using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickServe.Core.Entities;
using QuickServe.Core.Interfaces;
using QuickServe.Infrastructure.Data;

namespace QuickServe.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OnboardingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public OnboardingController(ApplicationDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        /// <summary>
        /// Step 1 — Save business profile details to the Tenant record.
        /// </summary>
        [HttpPost("wizard/profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileRequest request)
        {
            var tenant = await GetCurrentTenant();
            if (tenant == null) return NotFound(new { message = "Tenant not found." });

            tenant.RestaurantName = request.RestaurantName ?? tenant.RestaurantName;
            tenant.Address = request.Address ?? tenant.Address;
            tenant.Phone = request.Phone ?? tenant.Phone;
            tenant.RestaurantType = request.RestaurantType ?? tenant.RestaurantType;
            tenant.UpdatedAt = DateTime.UtcNow;

            // Save operating hours if provided
            if (request.OperatingHours?.Count > 0)
            {
                // Remove existing hours and replace
                var existingHours = await _context.OperatingHours
                    .Where(h => h.TenantId == tenant.Id)
                    .ToListAsync();
                _context.OperatingHours.RemoveRange(existingHours);

                foreach (var h in request.OperatingHours)
                {
                    _context.OperatingHours.Add(new OperatingHours
                    {
                        TenantId = tenant.Id,
                        DayOfWeek = h.DayOfWeek,
                        OpenTime = TimeSpan.Parse(h.OpenTime ?? "09:00"),
                        CloseTime = TimeSpan.Parse(h.CloseTime ?? "21:00"),
                        IsClosed = h.IsClosed
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Profile updated.", tenantId = tenant.Id });
        }

        /// <summary>
        /// Step 2 — Save branding details (color, typography, logo, description).
        /// </summary>
        [HttpPost("wizard/branding")]
        public async Task<IActionResult> UpdateBranding([FromBody] BrandingRequest request)
        {
            var tenant = await GetCurrentTenant();
            if (tenant == null) return NotFound(new { message = "Tenant not found." });

            tenant.PrimaryColor = request.PrimaryColor ?? tenant.PrimaryColor;
            tenant.Typography = request.Typography ?? tenant.Typography;
            tenant.LogoUrl = request.LogoUrl ?? tenant.LogoUrl;
            tenant.Description = request.Description ?? tenant.Description;
            if (!string.IsNullOrEmpty(request.DisplayBrandName))
                tenant.RestaurantName = request.DisplayBrandName;
            tenant.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Branding updated." });
        }

        /// <summary>
        /// Step 3 — Create initial menu with a category and item.
        /// </summary>
        [HttpPost("wizard/menu")]
        public async Task<IActionResult> UploadInitialMenu([FromBody] MenuSetupRequest request)
        {
            var tenantId = _tenantProvider.GetTenantId();

            // Create or find default menu
            var menu = await _context.Menus.FirstOrDefaultAsync();
            if (menu == null)
            {
                menu = new Menu { Title = "Main Menu", Description = "Default menu" };
                _context.Menus.Add(menu);
                await _context.SaveChangesAsync();
            }

            // Create category
            var category = new MenuCategory
            {
                MenuId = menu.Id,
                Name = request.CategoryName ?? "General"
            };
            _context.MenuCategories.Add(category);
            await _context.SaveChangesAsync();

            // Create item
            var item = new MenuItem
            {
                MenuCategoryId = category.Id,
                Name = request.ItemName ?? "New Item",
                Price = request.ItemPrice > 0 ? request.ItemPrice : 9.99m,
                IsAvailable = true
            };
            _context.MenuItems.Add(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Menu created.", menuId = menu.Id, categoryId = category.Id, itemId = item.Id });
        }

        /// <summary>
        /// Step 4 — Save payment / payout configuration.
        /// </summary>
        [HttpPost("wizard/payments")]
        public async Task<IActionResult> SavePaymentDetails([FromBody] PaymentSetupRequest request)
        {
            var tenant = await GetCurrentTenant();
            if (tenant == null) return NotFound(new { message = "Tenant not found." });

            // Upsert PaymentConfig
            var config = await _context.PaymentConfigs.FirstOrDefaultAsync(p => p.TenantId == tenant.Id);
            if (config == null)
            {
                config = new PaymentConfig { TenantId = tenant.Id };
                _context.PaymentConfigs.Add(config);
            }

            config.LegalName = request.LegalName ?? config.LegalName;
            config.TaxId = request.TaxId ?? config.TaxId;
            config.BankAccountLast4 = request.BankAccount ?? config.BankAccountLast4;
            config.PayoutSchedule = request.PayoutSchedule ?? config.PayoutSchedule;
            config.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Payment details saved." });
        }

        /// <summary>
        /// Step 5 — Publish the restaurant (make it live on the storefront).
        /// </summary>
        [HttpPost("wizard/publish")]
        public async Task<IActionResult> Publish()
        {
            var tenant = await GetCurrentTenant();
            if (tenant == null) return NotFound(new { message = "Tenant not found." });

            tenant.IsPublished = true;
            tenant.OnboardingComplete = true;
            tenant.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Your restaurant is now live!", slug = tenant.Slug });
        }

        /// <summary>
        /// GET — retrieve current onboarding state for the wizard to resume.
        /// </summary>
        [HttpGet("status")]
        public async Task<IActionResult> GetOnboardingStatus()
        {
            var tenant = await GetCurrentTenant();
            if (tenant == null) return NotFound(new { message = "Tenant not found." });

            var hasMenu = await _context.Menus.AnyAsync();
            var hasPayment = await _context.PaymentConfigs.AnyAsync(p => p.TenantId == tenant.Id);

            return Ok(new
            {
                tenant.RestaurantName,
                tenant.Address,
                tenant.Phone,
                tenant.RestaurantType,
                tenant.PrimaryColor,
                tenant.Typography,
                tenant.LogoUrl,
                tenant.Description,
                tenant.IsPublished,
                tenant.OnboardingComplete,
                HasMenu = hasMenu,
                HasPayment = hasPayment
            });
        }

        private async Task<Tenant?> GetCurrentTenant()
        {
            var tenantIdStr = _tenantProvider.GetTenantId();
            if (!Guid.TryParse(tenantIdStr, out var tenantId))
                return null;

            return await _context.Tenants
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(t => t.Id == tenantId);
        }
    }

    // --- Request DTOs ---

    public class ProfileRequest
    {
        public string? RestaurantName { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? RestaurantType { get; set; }
        public List<OperatingHoursDto>? OperatingHours { get; set; }
    }

    public class OperatingHoursDto
    {
        public DayOfWeek DayOfWeek { get; set; }
        public string? OpenTime { get; set; }
        public string? CloseTime { get; set; }
        public bool IsClosed { get; set; }
    }

    public class BrandingRequest
    {
        public string? DisplayBrandName { get; set; }
        public string? PrimaryColor { get; set; }
        public string? Typography { get; set; }
        public string? LogoUrl { get; set; }
        public string? Description { get; set; }
    }

    public class MenuSetupRequest
    {
        public string? CategoryName { get; set; }
        public string? ItemName { get; set; }
        public decimal ItemPrice { get; set; }
    }

    public class PaymentSetupRequest
    {
        public string? LegalName { get; set; }
        public string? TaxId { get; set; }
        public string? BankAccount { get; set; }
        public string? PayoutSchedule { get; set; }
    }
}
