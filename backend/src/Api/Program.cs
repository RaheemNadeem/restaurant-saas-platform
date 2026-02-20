using Api.Infrastructure;
using Api.Modules.Menu;
using Api.Modules.Tenancy;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<ITenantContext, TenantContext>();
builder.Services.AddSingleton<IMenuRepository, InMemoryMenuRepository>();

// Sprint 1 Postgres wiring baseline (activated when POSTGRES_CONNECTION is set)
var postgres = builder.Configuration["POSTGRES_CONNECTION"];
if (!string.IsNullOrWhiteSpace(postgres))
{
    builder.Services.AddDbContext<MenuDbContext>(opts => opts.UseNpgsql(postgres));
    builder.Services.AddScoped<TenantDbConnectionInterceptor>();
}

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseMiddleware<TenantResolutionMiddleware>();

app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "restaurant-saas-api" }));

app.MapGet("/api/menu/items", (ITenantContext tenantContext, IMenuRepository repo) =>
{
    if (string.IsNullOrWhiteSpace(tenantContext.TenantId))
    {
        return Results.BadRequest(new { error = "Missing tenant context" });
    }

    return Results.Ok(repo.GetForTenant(tenantContext.TenantId));
});

app.MapPost("/api/menu/items", (CreateMenuItemRequest request, ITenantContext tenantContext, IMenuRepository repo) =>
{
    if (string.IsNullOrWhiteSpace(tenantContext.TenantId))
    {
        return Results.BadRequest(new { error = "Missing tenant context" });
    }

    var created = repo.Create(tenantContext.TenantId, request.Name, request.Price);
    return Results.Created($"/api/menu/items/{created.Id}", created);
});

app.MapPut("/api/menu/items/{id:guid}", (Guid id, UpdateMenuItemRequest request, ITenantContext tenantContext, IMenuRepository repo) =>
{
    if (string.IsNullOrWhiteSpace(tenantContext.TenantId))
    {
        return Results.BadRequest(new { error = "Missing tenant context" });
    }

    var updated = repo.Update(tenantContext.TenantId, id, request.Name, request.Price);
    return updated ? Results.NoContent() : Results.NotFound();
});

app.Run();

public partial class Program;
