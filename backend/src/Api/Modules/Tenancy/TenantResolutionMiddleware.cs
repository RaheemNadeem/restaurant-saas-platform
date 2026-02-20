using Api.Infrastructure;

namespace Api.Modules.Tenancy;

public sealed class TenantResolutionMiddleware(RequestDelegate next)
{
    private const string TenantHeader = "X-Tenant-Id";

    public async Task InvokeAsync(HttpContext context, ITenantContext tenantContext)
    {
        tenantContext.TenantId = context.Request.Headers[TenantHeader].FirstOrDefault()?.Trim();
        await next(context);
    }
}
