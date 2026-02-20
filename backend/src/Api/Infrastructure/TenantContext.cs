namespace Api.Infrastructure;

public interface ITenantContext
{
    string? TenantId { get; set; }
}

public sealed class TenantContext : ITenantContext
{
    public string? TenantId { get; set; }
}
