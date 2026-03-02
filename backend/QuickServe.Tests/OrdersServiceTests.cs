using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickServe.API.Controllers;
using QuickServe.Core.Entities;
using QuickServe.Core.Interfaces;
using QuickServe.Infrastructure.Data;
using Xunit;

namespace QuickServe.Tests
{
    /// <summary>
    /// Minimal test double for INotificationService — records calls without side-effects.
    /// </summary>
    public class SpyNotificationService : INotificationService
    {
        public List<string> SentNotifications { get; } = new();

        public Task SendOrderCreatedNotification(Guid orderId, string email)
        {
            SentNotifications.Add($"Created:{orderId}:{email}");
            return Task.CompletedTask;
        }

        public Task SendOrderPreparingNotification(Guid orderId, string email)
        {
            SentNotifications.Add($"Preparing:{orderId}:{email}");
            return Task.CompletedTask;
        }

        public Task SendOrderReadyNotification(Guid orderId, string email)
        {
            SentNotifications.Add($"Ready:{orderId}:{email}");
            return Task.CompletedTask;
        }
    }

    public class OrdersServiceTests
    {
        private static ApplicationDbContext GetDbContext(string dbName = "")
        {
            if (string.IsNullOrEmpty(dbName))
                dbName = $"OrdersTest_{Guid.NewGuid()}";

            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;

            return new ApplicationDbContext(options, new TestTenantProvider("tenant-test"));
        }

        private static OrdersController GetController(ApplicationDbContext db, INotificationService? notifications = null)
        {
            var spy = notifications ?? new SpyNotificationService();
            var controller = new OrdersController(db, spy);
            // Provide a minimal HTTP context so ControllerBase.Ok() works
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            return controller;
        }

        // ─── Checkout Tests ──────────────────────────────────────────────────────

        [Fact]
        public async Task Checkout_WithNoItems_ReturnsBadRequest()
        {
            using var db = GetDbContext();
            var controller = GetController(db);

            var request = new CheckoutRequest
            {
                CustomerName = "Alice",
                CustomerEmail = "alice@example.com",
                Subtotal = 20.00m,
                Items = new List<CartItemDto>()  // empty
            };

            var result = await controller.Checkout(request);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Checkout_WithValidItems_NoCoupon_CreatesOrderAndPersistsItems()
        {
            using var db = GetDbContext();
            var spy = new SpyNotificationService();
            var controller = GetController(db, spy);

            var request = new CheckoutRequest
            {
                CustomerName = "Bob",
                CustomerEmail = "bob@example.com",
                Subtotal = 30.00m,
                Items = new List<CartItemDto>
                {
                    new() { MenuItemId = "item-1", Name = "Burger", Price = 15.00m, Quantity = 2 }
                }
            };

            var result = await controller.Checkout(request);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = okResult.Value as dynamic;

            // Check the order was saved in the DB with the correct item
            var savedOrders = await db.Orders.Include(o => o.Items).ToListAsync();
            Assert.Single(savedOrders);
            Assert.Single(savedOrders[0].Items);
            Assert.Equal("Burger", savedOrders[0].Items[0].Name);
            Assert.Equal(2, savedOrders[0].Items[0].Quantity);
            Assert.Equal(15.00m, savedOrders[0].Items[0].Price);

            // Verify notification was fired
            Assert.Single(spy.SentNotifications);
            Assert.Contains("Created:", spy.SentNotifications[0]);
        }

        [Fact]
        public async Task Checkout_WithPercentCoupon_AppliesDiscountCorrectly()
        {
            var dbName = $"CouponTest_{Guid.NewGuid()}";
            using var db = GetDbContext(dbName);

            // Seed a 10% coupon
            db.Coupons.Add(new Coupon
            {
                Code = "SAVE10",
                Type = DiscountType.Percent,
                DiscountValue = 10,
                MaxUses = 100,
                CurrentUses = 0,
                ValidUntil = DateTime.UtcNow.AddDays(30)
            });
            await db.SaveChangesAsync();

            var controller = GetController(db);
            var request = new CheckoutRequest
            {
                CustomerName = "Carol",
                CustomerEmail = "carol@example.com",
                Subtotal = 100.00m,
                CouponCode = "SAVE10",
                Items = new List<CartItemDto>
                {
                    new() { MenuItemId = "item-2", Name = "Salad", Price = 100.00m, Quantity = 1 }
                }
            };

            var result = await controller.Checkout(request);

            var okResult = Assert.IsType<OkObjectResult>(result);

            // 10% of 100 = 10 discount, 90 subtotal, 90 * 1.08 = 97.20 total
            var order = await db.Orders.FirstOrDefaultAsync();
            Assert.NotNull(order);
            Assert.Equal(10.00m, order.Discount);
            Assert.Equal(90.00m * 1.08m, order.Total, 2);
        }

        [Fact]
        public async Task Checkout_WithInvalidCoupon_ReturnsBadRequest()
        {
            using var db = GetDbContext();
            var controller = GetController(db);

            var request = new CheckoutRequest
            {
                CustomerName = "Dave",
                CustomerEmail = "dave@example.com",
                Subtotal = 50.00m,
                CouponCode = "DOESNOTEXIST",
                Items = new List<CartItemDto>
                {
                    new() { MenuItemId = "item-3", Name = "Pizza", Price = 50.00m, Quantity = 1 }
                }
            };

            var result = await controller.Checkout(request);

            Assert.IsType<BadRequestObjectResult>(result);

            // No order should have been saved
            var orderCount = await db.Orders.CountAsync();
            Assert.Equal(0, orderCount);
        }

        [Fact]
        public async Task Checkout_CouponUsageLimit_ReturnsBadRequest()
        {
            using var db = GetDbContext();

            db.Coupons.Add(new Coupon
            {
                Code = "MAXED",
                Type = DiscountType.Percent,
                DiscountValue = 20,
                MaxUses = 5,
                CurrentUses = 5,  // Already at limit
                ValidUntil = DateTime.UtcNow.AddDays(30)
            });
            await db.SaveChangesAsync();

            var controller = GetController(db);
            var request = new CheckoutRequest
            {
                CustomerName = "Eve",
                CustomerEmail = "eve@example.com",
                Subtotal = 40.00m,
                CouponCode = "MAXED",
                Items = new List<CartItemDto>
                {
                    new() { MenuItemId = "item-4", Name = "Tacos", Price = 40.00m, Quantity = 1 }
                }
            };

            var result = await controller.Checkout(request);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        // ─── Status Update Tests ─────────────────────────────────────────────────

        [Fact]
        public async Task UpdateOrderStatus_ToPreparing_FiresPreparingNotification()
        {
            using var db = GetDbContext();
            var spy = new SpyNotificationService();

            // Seed an existing order
            var orderId = Guid.NewGuid();
            db.Orders.Add(new Order
            {
                Id = orderId,
                OrderNumber = "QS-0001",
                CustomerName = "Frank",
                CustomerEmail = "frank@example.com",
                Subtotal = 25.00m,
                Total = 27.00m,
                Status = "Created",
                CreatedAt = DateTime.UtcNow
            });
            await db.SaveChangesAsync();

            var controller = GetController(db, spy);
            var result = await controller.UpdateOrderStatus(orderId, new UpdateStatusRequest { Status = "Preparing" });

            Assert.IsType<OkObjectResult>(result);

            var updated = await db.Orders.FindAsync(orderId);
            Assert.Equal("Preparing", updated!.Status);
            Assert.Single(spy.SentNotifications);
            Assert.Contains("Preparing:", spy.SentNotifications[0]);
        }

        [Fact]
        public async Task UpdateOrderStatus_ToReady_FiresReadyNotification()
        {
            using var db = GetDbContext();
            var spy = new SpyNotificationService();

            var orderId = Guid.NewGuid();
            db.Orders.Add(new Order
            {
                Id = orderId,
                OrderNumber = "QS-0002",
                CustomerName = "Grace",
                CustomerEmail = "grace@example.com",
                Subtotal = 18.00m,
                Total = 19.44m,
                Status = "Preparing",
                CreatedAt = DateTime.UtcNow
            });
            await db.SaveChangesAsync();

            var controller = GetController(db, spy);
            var result = await controller.UpdateOrderStatus(orderId, new UpdateStatusRequest { Status = "Ready" });

            Assert.IsType<OkObjectResult>(result);
            Assert.Contains("Ready:", spy.SentNotifications[0]);
        }

        [Fact]
        public async Task UpdateOrderStatus_ForNonExistentOrder_ReturnsNotFound()
        {
            using var db = GetDbContext();
            var controller = GetController(db);

            var result = await controller.UpdateOrderStatus(Guid.NewGuid(), new UpdateStatusRequest { Status = "Preparing" });

            Assert.IsType<NotFoundResult>(result);
        }
    }
}
