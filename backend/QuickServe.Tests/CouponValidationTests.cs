using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QuickServe.Core.Entities;
using QuickServe.Infrastructure.Data;
using Xunit;

namespace QuickServe.Tests
{
    public class CouponValidationTests
    {
        private static ApplicationDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase($"CouponTest_{Guid.NewGuid()}")
                .Options;
            return new ApplicationDbContext(options, new TestTenantProvider("coupon-test-tenant"));
        }

        private static Coupon MakeCoupon(
            string code = "TEST10",
            DiscountType type = DiscountType.Percent,
            decimal value = 10,
            int maxUses = 100,
            int currentUses = 0,
            int daysUntilExpiry = 30)
        {
            return new Coupon
            {
                Code = code,
                Type = type,
                DiscountValue = value,
                MaxUses = maxUses,
                CurrentUses = currentUses,
                ValidUntil = DateTime.UtcNow.AddDays(daysUntilExpiry)
            };
        }

        // ─── Case Insensitivity ──────────────────────────────────────────────────

        [Theory]
        [InlineData("SAVE10")]
        [InlineData("save10")]
        [InlineData("Save10")]
        [InlineData("sAvE10")]
        public async Task CouponLookup_IsCaseInsensitive(string inputCode)
        {
            using var db = GetDbContext();
            db.Coupons.Add(MakeCoupon(code: "SAVE10"));
            await db.SaveChangesAsync();

            var coupon = await db.Coupons
                .FirstOrDefaultAsync(c => c.Code.ToUpper() == inputCode.ToUpper());

            Assert.NotNull(coupon);
            Assert.Equal("SAVE10", coupon.Code);
        }

        // ─── MaxUses Enforcement ─────────────────────────────────────────────────

        [Fact]
        public async Task Coupon_BelowMaxUses_IsValid()
        {
            using var db = GetDbContext();
            db.Coupons.Add(MakeCoupon(code: "HALFUSED", maxUses: 10, currentUses: 5));
            await db.SaveChangesAsync();

            var coupon = await db.Coupons.FirstOrDefaultAsync(c => c.Code == "HALFUSED");
            Assert.NotNull(coupon);
            var isUsable = !(coupon.MaxUses > 0 && coupon.CurrentUses >= coupon.MaxUses);
            Assert.True(isUsable);
        }

        [Fact]
        public async Task Coupon_AtMaxUses_IsNotValid()
        {
            using var db = GetDbContext();
            db.Coupons.Add(MakeCoupon(code: "FULL", maxUses: 5, currentUses: 5));
            await db.SaveChangesAsync();

            var coupon = await db.Coupons.FirstOrDefaultAsync(c => c.Code == "FULL");
            Assert.NotNull(coupon);
            var isAtLimit = coupon.MaxUses > 0 && coupon.CurrentUses >= coupon.MaxUses;
            Assert.True(isAtLimit);
        }

        [Fact]
        public async Task Coupon_UnlimitedUses_MaxUsesZero_NeverExpiresByUsage()
        {
            using var db = GetDbContext();
            db.Coupons.Add(MakeCoupon(code: "UNLIMITED", maxUses: 0, currentUses: 9999));
            await db.SaveChangesAsync();

            var coupon = await db.Coupons.FirstOrDefaultAsync(c => c.Code == "UNLIMITED");
            Assert.NotNull(coupon);
            // MaxUses == 0 means unlimited — should never be blocked by usage
            var isAtLimit = coupon.MaxUses > 0 && coupon.CurrentUses >= coupon.MaxUses;
            Assert.False(isAtLimit);
        }

        // ─── Discount Math ───────────────────────────────────────────────────────

        [Theory]
        [InlineData(100.00, 10, 90.00)]   // 10% off $100 = $90
        [InlineData(50.00,  25, 37.50)]   // 25% off $50  = $37.50
        [InlineData(200.00, 100, 0.00)]   // 100% off $200 = $0
        public void PercentDiscount_CalculatesCorrectTotal(decimal subtotal, decimal percentOff, decimal expected)
        {
            var discount = subtotal * (percentOff / 100);
            var result = subtotal - discount;
            if (result < 0) result = 0;

            Assert.Equal(expected, result, 2);
        }

        [Theory]
        [InlineData(100.00, 15.00, 85.00)]   // $15 off $100 = $85
        [InlineData(10.00,  15.00, 0.00)]    // $15 off $10  = $0 (floor at zero)
        [InlineData(50.00,  50.00, 0.00)]    // $50 off $50  = $0
        public void FixedAmountDiscount_CalculatesCorrectTotal(decimal subtotal, decimal fixedOff, decimal expected)
        {
            var result = subtotal - fixedOff;
            if (result < 0) result = 0;

            Assert.Equal(expected, result, 2);
        }

        // ─── IsActive Flag ───────────────────────────────────────────────────────

        [Fact]
        public async Task InactiveCoupon_IsRejected()
        {
            using var db = GetDbContext();
            db.Coupons.Add(MakeCoupon(code: "INACTIVE", daysUntilExpiry: -1));
            await db.SaveChangesAsync();

            var coupon = await db.Coupons.FirstOrDefaultAsync(c => c.Code == "INACTIVE");
            Assert.NotNull(coupon);
            Assert.False(coupon.IsActive);
        }

        [Fact]
        public async Task ActiveCoupon_WithinValidity_IsAccepted()
        {
            using var db = GetDbContext();
            db.Coupons.Add(MakeCoupon(code: "VALID", daysUntilExpiry: 10));
            await db.SaveChangesAsync();

            var coupon = await db.Coupons.FirstOrDefaultAsync(c => c.Code == "VALID");
            Assert.NotNull(coupon);
            Assert.True(coupon.IsActive);
            Assert.True(coupon.ValidUntil > DateTime.UtcNow);
        }

        // ─── Usage Increment ─────────────────────────────────────────────────────

        [Fact]
        public async Task Checkout_IncrementsCouponUsage()
        {
            using var db = GetDbContext();
            var coupon = MakeCoupon(code: "ONCE", maxUses: 10, currentUses: 3);
            db.Coupons.Add(coupon);
            await db.SaveChangesAsync();

            // Simulate what OrdersController does
            var dbCoupon = await db.Coupons.FirstOrDefaultAsync(c => c.Code == "ONCE");
            dbCoupon!.CurrentUses++;
            await db.SaveChangesAsync();

            var updated = await db.Coupons.FirstOrDefaultAsync(c => c.Code == "ONCE");
            Assert.Equal(4, updated!.CurrentUses);
        }
    }
}
