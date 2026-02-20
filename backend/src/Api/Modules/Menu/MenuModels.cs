namespace Api.Modules.Menu;

public sealed record MenuItem(Guid Id, string TenantId, string Name, decimal Price);

public sealed record CreateMenuItemRequest(string Name, decimal Price);
public sealed record UpdateMenuItemRequest(string Name, decimal Price);
