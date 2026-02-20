using Api.Modules.Menu;
using Microsoft.EntityFrameworkCore;

namespace Api.Infrastructure;

public sealed class MenuDbContext(DbContextOptions<MenuDbContext> options) : DbContext(options)
{
    public DbSet<MenuItemEntity> MenuItems => Set<MenuItemEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MenuItemEntity>(e =>
        {
            e.ToTable("tenant_menu_items");
            e.HasKey(x => x.Id);
            e.Property(x => x.TenantId).HasColumnName("tenant_id").IsRequired();
            e.Property(x => x.Name).HasColumnName("name").IsRequired();
            e.Property(x => x.Price).HasColumnName("price").HasPrecision(10, 2);
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
        });
    }
}

public sealed class MenuItemEntity
{
    public Guid Id { get; set; }
    public string TenantId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}
