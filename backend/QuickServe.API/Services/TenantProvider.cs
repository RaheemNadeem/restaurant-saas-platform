using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using QuickServe.Core.Interfaces;

namespace QuickServe.API.Services
{
    public class TenantProvider : ITenantProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TenantProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetTenantId()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null) return "default-tenant";

            // Priority 1: Read tenantId from JWT claims (set during login)
            var tenantClaim = context.User?.FindFirst("tenantId")?.Value;
            if (!string.IsNullOrEmpty(tenantClaim))
                return tenantClaim;

            // Priority 2: Explicit header (for customer-facing / anonymous endpoints)
            var headerTenant = context.Request.Headers["X-Tenant-Id"].ToString();
            if (!string.IsNullOrEmpty(headerTenant))
                return headerTenant;

            // Fallback for development
            return "default-tenant";
        }
    }
}
