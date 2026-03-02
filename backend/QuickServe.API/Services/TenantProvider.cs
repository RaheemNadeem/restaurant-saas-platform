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
            // Typical implementation uses a claim, header, or routing value
            var tenantId = _httpContextAccessor.HttpContext?.Request.Headers["X-Tenant-Id"].ToString();
            
            if (string.IsNullOrEmpty(tenantId)) 
            {
                // Fallback testing default or throw
                return "default-tenant";
            }
            
            return tenantId;
        }
    }
}
