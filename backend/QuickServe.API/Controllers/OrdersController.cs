using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickServe.Core.Entities;
using QuickServe.Core.Interfaces;
using QuickServe.Infrastructure.Data;
using QuickServe.API.Services;

namespace QuickServe.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly IPaymentService _paymentService;

        public OrdersController(ApplicationDbContext context, INotificationService notificationService, IPaymentService paymentService)
        {
            _context = context;
            _notificationService = notificationService;
            _paymentService = paymentService;
        }

        /// <summary>
        /// Validates a coupon code without placing an order.
        /// Used by the frontend to preview the discounted total before final checkout.
        /// </summary>
        [AllowAnonymous]
        [HttpPost("validate-coupon")]
        public async Task<IActionResult> ValidateCoupon([FromBody] ValidateCouponRequest request)
        {
            if (string.IsNullOrEmpty(request.CouponCode))
                return BadRequest("Coupon code is required.");

            var coupon = await _context.Coupons
                .FirstOrDefaultAsync(c => c.Code.ToUpper() == request.CouponCode.ToUpper());

            if (coupon == null || !coupon.IsActive)
                return BadRequest("Invalid or expired coupon code.");

            if (coupon.MaxUses > 0 && coupon.CurrentUses >= coupon.MaxUses)
                return BadRequest("Coupon usage limit reached.");

            decimal discountedSubtotal = request.Subtotal;
            if (coupon.Type == DiscountType.Percent)
                discountedSubtotal -= request.Subtotal * (coupon.DiscountValue / 100);
            else if (coupon.Type == DiscountType.FixedAmount)
                discountedSubtotal -= coupon.DiscountValue;

            if (discountedSubtotal < 0) discountedSubtotal = 0;

            return Ok(new
            {
                CouponCode = coupon.Code,
                DiscountType = coupon.Type.ToString(),
                DiscountValue = coupon.DiscountValue,
                OriginalSubtotal = request.Subtotal,
                DiscountedSubtotal = discountedSubtotal
            });
        }

        /// <summary>
        /// Places an order with real cart items from the customer's basket.
        /// </summary>
        [AllowAnonymous]
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
        {
            if (request.Items == null || request.Items.Count == 0)
                return BadRequest("Order must contain at least one item.");

            decimal finalSubtotal = request.Subtotal;
            Coupon? appliedCoupon = null;

            // Apply coupon discount if provided
            if (!string.IsNullOrEmpty(request.CouponCode))
            {
                var coupon = await _context.Coupons
                    .FirstOrDefaultAsync(c => c.Code.ToUpper() == request.CouponCode.ToUpper());

                if (coupon == null || !coupon.IsActive)
                    return BadRequest("Invalid or expired coupon code.");

                if (coupon.MaxUses > 0 && coupon.CurrentUses >= coupon.MaxUses)
                    return BadRequest("Coupon usage limit reached.");

                if (coupon.Type == DiscountType.Percent)
                    finalSubtotal -= request.Subtotal * (coupon.DiscountValue / 100);
                else if (coupon.Type == DiscountType.FixedAmount)
                    finalSubtotal -= coupon.DiscountValue;

                if (finalSubtotal < 0) finalSubtotal = 0;

                coupon.CurrentUses++;
                _context.Entry(coupon).State = EntityState.Modified;
                appliedCoupon = coupon;
            }

            decimal tax = finalSubtotal * 0.08m;
            decimal finalTotal = finalSubtotal + tax;
            decimal discount = request.Subtotal - finalSubtotal;

            var orderId = Guid.NewGuid();
            var orderNumber = "QS-" + Random.Shared.Next(1000, 9999).ToString();

            var order = new Order
            {
                Id = orderId,
                OrderNumber = orderNumber,
                CustomerName = request.CustomerName ?? "Guest",
                CustomerEmail = request.CustomerEmail ?? "guest@quickserve.app",
                Subtotal = request.Subtotal,
                Discount = discount,
                Total = finalTotal,
                Status = "Created",
                CreatedAt = DateTime.UtcNow,
                // Map real cart items from the frontend
                Items = request.Items.Select(i => new OrderItem
                {
                    Name = i.Name,
                    Price = i.Price,
                    Quantity = i.Quantity
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            await _notificationService.SendOrderCreatedNotification(orderId, order.CustomerEmail);

            // Create a PaymentIntent through the injected PaymentService for Sandbox testing
            var paymentIntent = await _paymentService.CreatePaymentIntentAsync(order);

            return Ok(new
            {
                OrderId = orderId,
                OrderNumber = orderNumber,
                Subtotal = request.Subtotal,
                Discount = discount,
                Tax = tax,
                Total = finalTotal,
                DiscountApplied = appliedCoupon != null ? appliedCoupon.Code : null,
                Status = "Created",
                ClientSecret = paymentIntent.ClientSecret
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

            var validTransitions = new Dictionary<string, List<string>>
            {
                { "Created", new List<string> { "Paid", "Cancelled" } },
                { "Paid", new List<string> { "Preparing", "Cancelled" } },
                { "Preparing", new List<string> { "Ready", "Cancelled" } },
                { "Ready", new List<string> { "Completed", "Cancelled" } },
                { "Completed", new List<string>() },
                { "Cancelled", new List<string>() }
            };

            var currentStatus = order.Status;
            var targetStatus = request.Status;

            if (!validTransitions.ContainsKey(currentStatus) || !validTransitions[currentStatus].Contains(targetStatus))
            {
                return BadRequest($"Invalid state transition from {currentStatus} to {targetStatus}.");
            }

            order.Status = targetStatus;
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            if (request.Status == "Preparing")
                await _notificationService.SendOrderPreparingNotification(id, order.CustomerEmail);
            else if (request.Status == "Ready")
                await _notificationService.SendOrderReadyNotification(id, order.CustomerEmail);

            return Ok(new { OrderId = id, Status = request.Status });
        }
    }

    // ─── DTOs ───────────────────────────────────────────────────────────────────

    public class ValidateCouponRequest
    {
        public decimal Subtotal { get; set; }
        public string CouponCode { get; set; } = string.Empty;
    }

    public class CartItemDto
    {
        public string MenuItemId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }

    public class CheckoutRequest
    {
        public string? CustomerName { get; set; }
        public string? CustomerEmail { get; set; }
        public decimal Subtotal { get; set; }
        public string? CouponCode { get; set; }
        public List<CartItemDto> Items { get; set; } = new();
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}
