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
        private ApplicationDbContext GetDbContext(string tenantId)
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "QuickServeTestDb")
                .Options;

            return new ApplicationDbContext(options, new TestTenantProvider(tenantId));
        }

        [Fact]
        public async Task TenantA_CannotSee_TenantB_Data()
        {
            // Arrange
            var tenantAId = "tenant-a-123";
            var tenantBId = "tenant-b-456";

            using (var dbA = GetDbContext(tenantAId))
            {
                var menuA = new Menu
                {
                    Title = "Tenant A Menu",
                    Description = "Menu for Tenant A"
                };
                dbA.Menus.Add(menuA);
                await dbA.SaveChangesAsync(); // Infrastructure automatically sets TenantId
            }

            // Act & Assert
            using (var dbB = GetDbContext(tenantBId))
            {
                // Attempt to query all menus using Tenant B's context
                var dbBMenus = await dbB.Menus.ToListAsync();
                
                // Assert that Tenant B gets no results
                Assert.Empty(dbBMenus);
            }
            
            using (var dbAGain = GetDbContext(tenantAId))
            {
                // Verify Tenant A can still see their own
                var dbAMenus = await dbAGain.Menus.ToListAsync();
                Assert.Single(dbAMenus);
                Assert.Equal("Tenant A Menu", dbAMenus.First().Title);
            }
        }
    }
}
