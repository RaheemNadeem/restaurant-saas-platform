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
        /// Returns all registered tenants (from Users table, grouped by tenant).
        /// </summary>
        [HttpGet("tenants")]
        public async Task<IActionResult> GetTenants()
        {
            // Get all merchant users with their basic info
            var merchants = await _context.Users
                .Where(u => u.Role == "Merchant")
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.CreatedAt
                })
                .ToListAsync();

            return Ok(merchants);
        }

        /// <summary>
        /// Platform-level summary: total merchants, total orders, total revenue.
        /// </summary>
        [HttpGet("summary")]
        public async Task<IActionResult> GetPlatformSummary()
        {
            var totalMerchants = await _context.Users.CountAsync(u => u.Role == "Merchant");

            // IgnoreQueryFilters to count across ALL tenants
            var totalOrders = await _context.Orders.IgnoreQueryFilters().CountAsync();
            var totalRevenue = await _context.Orders.IgnoreQueryFilters().SumAsync(o => o.Total);

            return Ok(new
            {
                TotalMerchants = totalMerchants,
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                AsOf = DateTime.UtcNow
            });
        }
    }
}
