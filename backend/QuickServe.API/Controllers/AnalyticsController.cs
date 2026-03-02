using Microsoft.AspNetCore.Mvc;
using QuickServe.Core.Entities;
using QuickServe.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace QuickServe.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnalyticsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("funnel")]
        public IActionResult GetFunnelMetrics()
        {
            // In a real app, these would come from an Analytics/Events table.
            // For Sprint 6, we simulate dynamic numbers based on base conversion rates.
            return Ok(new
            {
                StorefrontViews = 1250,
                CartAdditions = 450,
                CheckoutsStarted = 320,
                OrdersCompleted = 215,
                TotalRevenue = 5480.50
            });
        }

        [HttpGet("tenant-health")]
        public IActionResult GetTenantHealth()
        {
            return Ok(new
            {
                ActiveOrders = 12,
                CompletedToday = 45,
                AveragePrepTime = "18 min",
                CustomerRating = 4.8,
                TopSeller = "Chicken Shawarma Wrap"
            });
        }
    }
}
