using System.Data.Common;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Api.Infrastructure;

public sealed class TenantDbConnectionInterceptor(ITenantContext tenantContext) : DbConnectionInterceptor
{
    public override async ValueTask<InterceptionResult> ConnectionOpeningAsync(
        DbConnection connection,
        ConnectionEventData eventData,
        InterceptionResult result,
        CancellationToken cancellationToken = default)
    {
        if (!string.IsNullOrWhiteSpace(tenantContext.TenantId) && connection is not null)
        {
            await using var cmd = connection.CreateCommand();
            cmd.CommandText = "select set_config('app.tenant_id', @tenant, true);";
            var p = cmd.CreateParameter();
            p.ParameterName = "@tenant";
            p.Value = tenantContext.TenantId;
            cmd.Parameters.Add(p);
            await cmd.ExecuteNonQueryAsync(cancellationToken);
        }

        return result;
    }
}
