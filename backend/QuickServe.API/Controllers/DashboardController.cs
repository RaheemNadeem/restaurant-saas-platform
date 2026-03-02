using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace QuickServe.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        [HttpGet("summary")]
        public IActionResult GetSummary()
        {
            var summary = new
            {
                TodayOrders = 142,
                OrderTrend = +15.2,
                Revenue = 5240.50,
                RevenueTrend = +3.1,
                AvgPickupTimeMinutes = 14,
                PickupTrendString = "3:12"
            };

            return Ok(summary);
        }

        [HttpGet("live-orders")]
        public IActionResult GetLiveOrders()
        {
            var liveOrders = new[]
            {
                new { OrderId = "#QS-7045", CustomerName = "Sarah Jenkins", ItemCount = 2, ReadyInMinutes = 8, Total = 24.50, Status = "Preparing" },
                new { OrderId = "#QS-7046", CustomerName = "Mike Ross", ItemCount = 1, ReadyInMinutes = 12, Total = 11.20, Status = "New" },
                new { OrderId = "#QS-7044", CustomerName = "Emily Clark", ItemCount = 4, ReadyInMinutes = 3, Total = 64.00, Status = "Ready" }
            };

            return Ok(liveOrders);
        }
    }
}
