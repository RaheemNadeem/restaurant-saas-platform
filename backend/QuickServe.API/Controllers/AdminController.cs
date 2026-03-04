using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickServe.Infrastructure.Data;

namespace QuickServe.API.Controllers
{
    /// <summary>
    /// Super-Admin endpoint for platform-level tenant management.
    /// Bypasses tenant query filters to show all data across tenants.
    /// Protected by the "Admin" role claim.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Returns all registered tenants with restaurant details and order counts.
        /// </summary>
        [HttpGet("tenants")]
        public async Task<IActionResult> GetTenants()
        {
            var tenants = await _context.Tenants
                .IgnoreQueryFilters()
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new
                {
                    t.Id,
                    t.RestaurantName,
                    t.Slug,
                    t.Address,
                    t.Phone,
                    t.RestaurantType,
                    t.IsPublished,
                    t.OnboardingComplete,
                    t.CreatedAt,
                    OwnerEmail = _context.Users
                        .Where(u => u.Id == t.OwnerId)
                        .Select(u => u.Email)
                        .FirstOrDefault() ?? "—",
                    OrderCount = _context.Orders
                        .IgnoreQueryFilters()
                        .Count(o => o.TenantId == t.Id.ToString()),
                    Revenue = _context.Orders
                        .IgnoreQueryFilters()
                        .Where(o => o.TenantId == t.Id.ToString())
                        .Sum(o => (decimal?)o.Total) ?? 0m
                })
                .ToListAsync();

            return Ok(tenants);
        }

        /// <summary>
        /// Platform-level summary: total tenants, merchants, orders, revenue.
        /// </summary>
        [HttpGet("summary")]
        public async Task<IActionResult> GetPlatformSummary()
        {
            var totalTenants = await _context.Tenants.IgnoreQueryFilters().CountAsync();
            var totalMerchants = await _context.Users.CountAsync(u => u.Role == "Merchant");
            var totalOrders = await _context.Orders.IgnoreQueryFilters().CountAsync();
            var totalRevenue = await _context.Orders.IgnoreQueryFilters().SumAsync(o => (decimal?)o.Total) ?? 0m;
            var publishedTenants = await _context.Tenants.IgnoreQueryFilters().CountAsync(t => t.IsPublished);

            return Ok(new
            {
                TotalTenants = totalTenants,
                PublishedTenants = publishedTenants,
                TotalMerchants = totalMerchants,
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                AsOf = DateTime.UtcNow
            });
        }
    }
}
