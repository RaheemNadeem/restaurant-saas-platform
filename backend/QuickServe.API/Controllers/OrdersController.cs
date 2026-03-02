using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickServe.Core.Entities;
using QuickServe.Core.Interfaces;
using QuickServe.Infrastructure.Data;
using System.Linq;

namespace QuickServe.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public OrdersController(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
        {
            // Note: A real app would validate items, check prices in DB, etc. 
            // For now, we trust the subtotal for the purposes of Sprint 6 promo testing.
            decimal finalTotal = request.Subtotal;
            Coupon appliedCoupon = null;

            if (!string.IsNullOrEmpty(request.CouponCode))
            {
                var coupon = await _context.Coupons
                    .FirstOrDefaultAsync(c => c.Code.ToUpper() == request.CouponCode.ToUpper());

                if (coupon == null || !coupon.IsActive)
                {
                    return BadRequest("Invalid or expired coupon code.");
                }

                if (coupon.MaxUses > 0 && coupon.CurrentUses >= coupon.MaxUses)
                {
                    return BadRequest("Coupon usage limit reached.");
                }

                if (coupon.Type == DiscountType.Percent)
                {
                    var discountAmount = finalTotal * (coupon.DiscountValue / 100);
                    finalTotal -= discountAmount;
                }
                else if (coupon.Type == DiscountType.FixedAmount)
                {
                    finalTotal -= coupon.DiscountValue;
                }

                // Never go below zero
                if (finalTotal < 0) finalTotal = 0;

                // Increment usage
                coupon.CurrentUses++;
                _context.Entry(coupon).State = EntityState.Modified;
                appliedCoupon = coupon;
            }

            // In a real app we'd save the order entity here.
            var orderId = Guid.NewGuid();
            var orderNumber = "QS-" + (new Random().Next(1000, 9999)).ToString();

            var order = new Order
            {
                Id = orderId,
                OrderNumber = orderNumber,
                CustomerName = "Chris Park", // Mock for now
                CustomerEmail = "customer@example.com",
                Subtotal = request.Subtotal,
                Discount = request.Subtotal - finalTotal,
                Total = finalTotal,
                Status = "Created",
                CreatedAt = request.CreatedAt ?? DateTime.UtcNow,
                Items = new List<OrderItem>
                {
                    new OrderItem { Name = "Ported Mock Item", Price = request.Subtotal, Quantity = 1 }
                }
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Trigger notification
            await _notificationService.SendOrderCreatedNotification(orderId, "customer@example.com");

            return Ok(new
            {
                OrderId = orderId,
                OrderNumber = orderNumber,
                Subtotal = request.Subtotal,
                DiscountApplied = appliedCoupon != null ? request.CouponCode : null,
                FinalTotal = finalTotal,
                Status = "Created"
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateStatusRequest request)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = request.Status;
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            if (request.Status == "Preparing")
            {
                await _notificationService.SendOrderPreparingNotification(id, order.CustomerEmail);
            }
            else if (request.Status == "Ready")
            {
                await _notificationService.SendOrderReadyNotification(id, order.CustomerEmail);
            }

            return Ok(new { OrderId = id, Status = request.Status });
        }
    }

    public class CheckoutRequest
    {
        public decimal Subtotal { get; set; }
        public string? CouponCode { get; set; }
        public DateTime? CreatedAt { get; set; }
        // cart items array would normally be here
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}
