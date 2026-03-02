using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QuickServe.Core.Entities;
using QuickServe.Core.Interfaces;
using QuickServe.Infrastructure.Data;
using Xunit;

namespace QuickServe.Tests
{
    public class TestTenantProvider : ITenantProvider
    {
        private readonly string _tenantId;

        public TestTenantProvider(string tenantId)
        {
            _tenantId = tenantId;
        }

        public string GetTenantId() => _tenantId;
    }

    public class TenantIsolationTests
    {
        /// <summary>
        /// Each test gets a unique database name to prevent state leakage
        /// between tests that share the InMemory provider.
        /// </summary>
        private ApplicationDbContext GetDbContext(string tenantId, string dbName)
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;

            return new ApplicationDbContext(options, new TestTenantProvider(tenantId));
        }

        [Fact]
        public async Task TenantA_CannotSee_TenantB_Data()
        {
            // Use a unique DB per test run to avoid cross-test contamination
            var dbName = $"IsolationTest_{Guid.NewGuid()}";
            var tenantAId = "tenant-a-123";
            var tenantBId = "tenant-b-456";

            // Arrange — seed Tenant A's menu
            using (var dbA = GetDbContext(tenantAId, dbName))
            {
                var menuA = new Menu
                {
                    Title = "Tenant A Menu",
                    Description = "Menu for Tenant A"
                };
                dbA.Menus.Add(menuA);
                await dbA.SaveChangesAsync();
            }

            // Act — query as Tenant B
            using (var dbB = GetDbContext(tenantBId, dbName))
            {
                var dbBMenus = await dbB.Menus.ToListAsync();

                // Assert that Tenant B sees nothing
                Assert.Empty(dbBMenus);
            }

            // Assert — Tenant A can still see their own data
            using (var dbAGain = GetDbContext(tenantAId, dbName))
            {
                var dbAMenus = await dbAGain.Menus.ToListAsync();
                Assert.Single(dbAMenus);
                Assert.Equal("Tenant A Menu", dbAMenus.First().Title);
            }
        }

        [Fact]
        public async Task TenantB_CannotSee_TenantA_Orders()
        {
            var dbName = $"OrderIsolationTest_{Guid.NewGuid()}";
            var tenantAId = "tenant-a-orders";
            var tenantBId = "tenant-b-orders";

            // Seed an order for Tenant A
            using (var dbA = GetDbContext(tenantAId, dbName))
            {
                var order = new Order
                {
                    Id = Guid.NewGuid(),
                    OrderNumber = "QS-1001",
                    CustomerName = "Alice",
                    CustomerEmail = "alice@example.com",
                    Subtotal = 20.00m,
                    Total = 20.00m,
                    Status = "Created",
                    CreatedAt = DateTime.UtcNow
                };
                dbA.Orders.Add(order);
                await dbA.SaveChangesAsync();
            }

            // Tenant B should see zero orders
            using (var dbB = GetDbContext(tenantBId, dbName))
            {
                var dbBOrders = await dbB.Orders.ToListAsync();
                Assert.Empty(dbBOrders);
            }

            // Tenant A should see their own order
            using (var dbAGain = GetDbContext(tenantAId, dbName))
            {
                var dbAOrders = await dbAGain.Orders.ToListAsync();
                Assert.Single(dbAOrders);
                Assert.Equal("QS-1001", dbAOrders.First().OrderNumber);
            }
        }

        [Fact]
        public async Task MultipleTenantsCanCoexist_WithIndependentData()
        {
            var dbName = $"MultiTenantTest_{Guid.NewGuid()}";

            var tenants = new[] { "tenant-x", "tenant-y", "tenant-z" };

            // Each tenant gets their own unique menu
            foreach (var t in tenants)
            {
                using var db = GetDbContext(t, dbName);
                db.Menus.Add(new Menu { Title = $"{t} Menu", Description = $"Menu for {t}" });
                await db.SaveChangesAsync();
            }

            // Each tenant should see exactly 1 menu — their own
            foreach (var t in tenants)
            {
                using var db = GetDbContext(t, dbName);
                var menus = await db.Menus.ToListAsync();
                Assert.Single(menus);
                Assert.Equal($"{t} Menu", menus.First().Title);
            }
        }
    }
}
