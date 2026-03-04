using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickServe.Core.Interfaces;
using QuickServe.Infrastructure.Data;

namespace QuickServe.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Returns real KPI summary computed from the tenant's orders.
        /// </summary>
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var today = DateTime.UtcNow.Date;
            var yesterday = today.AddDays(-1);

            // Today's orders
            var todayOrders = await _context.Orders
                .Where(o => o.CreatedAt >= today)
                .ToListAsync();

            var todayCount = todayOrders.Count;
            var todayRevenue = todayOrders.Sum(o => o.Total);

            // Yesterday's orders for trend calculation
            var yesterdayOrders = await _context.Orders
                .Where(o => o.CreatedAt >= yesterday && o.CreatedAt < today)
                .ToListAsync();

            var yesterdayCount = yesterdayOrders.Count;
            var yesterdayRevenue = yesterdayOrders.Sum(o => o.Total);

            // Trend percentages
            var orderTrend = yesterdayCount > 0
                ? Math.Round((double)(todayCount - yesterdayCount) / yesterdayCount * 100, 1)
                : 0;

            var revenueTrend = yesterdayRevenue > 0
                ? Math.Round((double)((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100, 1)
                : 0;

            // All-time stats
            var totalOrders = await _context.Orders.CountAsync();
            var totalRevenue = await _context.Orders.SumAsync(o => o.Total);

            return Ok(new
            {
                TodayOrders = todayCount,
                OrderTrend = orderTrend,
                Revenue = todayRevenue,
                RevenueTrend = revenueTrend,
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                AvgPickupTimeMinutes = 14, // Would need timestamps on status transitions for real calc
                PickupTrendString = "—"
            });
        }

        /// <summary>
        /// Returns real in-progress orders from the database (not Completed/Cancelled).
        /// </summary>
        [HttpGet("live-orders")]
        public async Task<IActionResult> GetLiveOrders()
        {
            var liveOrders = await _context.Orders
                .Include(o => o.Items)
                .Where(o => o.Status != "Completed" && o.Status != "Cancelled")
                .OrderByDescending(o => o.CreatedAt)
                .Take(20)
                .Select(o => new
                {
                    OrderId = o.OrderNumber,
                    CustomerName = o.CustomerName,
                    ItemCount = o.Items.Count,
                    ReadyInMinutes = (int)Math.Max(0, 15 - (DateTime.UtcNow - o.CreatedAt).TotalMinutes),
                    Total = o.Total,
                    Status = o.Status
                })
                .ToListAsync();

            return Ok(liveOrders);
        }
    }
}
