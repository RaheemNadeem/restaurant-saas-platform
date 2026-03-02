using Microsoft.EntityFrameworkCore;
using QuickServe.Core.Interfaces;
using QuickServe.Infrastructure.Data;
using QuickServe.API.Services;
using QuickServe.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure HTTP Context Accessor for the TenantProvider
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ITenantProvider, TenantProvider>();
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<INotificationService, LoggingNotificationService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:4201")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Configure PostgreSQL DbContext OR In-Memory for testing
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("QuickServeDb"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
