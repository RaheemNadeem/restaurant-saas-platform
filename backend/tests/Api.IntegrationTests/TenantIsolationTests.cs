using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Api.IntegrationTests;

public class TenantIsolationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public TenantIsolationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task TenantA_CannotRead_TenantB_Data()
    {
        var client = _factory.CreateClient();

        var postA = new HttpRequestMessage(HttpMethod.Post, "/api/menu/items")
        {
            Content = JsonContent.Create(new { name = "Burger", price = 12.5m })
        };
        postA.Headers.Add("X-Tenant-Id", "tenant-a");
        await client.SendAsync(postA);

        var postB = new HttpRequestMessage(HttpMethod.Post, "/api/menu/items")
        {
            Content = JsonContent.Create(new { name = "Pizza", price = 14m })
        };
        postB.Headers.Add("X-Tenant-Id", "tenant-b");
        await client.SendAsync(postB);

        var getA = new HttpRequestMessage(HttpMethod.Get, "/api/menu/items");
        getA.Headers.Add("X-Tenant-Id", "tenant-a");
        var responseA = await client.SendAsync(getA);
        responseA.EnsureSuccessStatusCode();

        var text = await responseA.Content.ReadAsStringAsync();
        Assert.Contains("Burger", text);
        Assert.DoesNotContain("Pizza", text);
    }

    [Fact]
    public async Task TenantA_CannotUpdate_TenantB_Item()
    {
        var client = _factory.CreateClient();

        var postB = new HttpRequestMessage(HttpMethod.Post, "/api/menu/items")
        {
            Content = JsonContent.Create(new { name = "Pizza", price = 14m })
        };
        postB.Headers.Add("X-Tenant-Id", "tenant-b");
        var createdResponse = await client.SendAsync(postB);
        createdResponse.EnsureSuccessStatusCode();

        var createdJson = await createdResponse.Content.ReadFromJsonAsync<MenuItemDto>();
        Assert.NotNull(createdJson);

        var updateFromA = new HttpRequestMessage(HttpMethod.Put, $"/api/menu/items/{createdJson!.id}")
        {
            Content = JsonContent.Create(new { name = "Hacked Pizza", price = 1m })
        };
        updateFromA.Headers.Add("X-Tenant-Id", "tenant-a");
        var updateResponse = await client.SendAsync(updateFromA);
        Assert.Equal(HttpStatusCode.NotFound, updateResponse.StatusCode);
    }

    [Fact]
    public async Task MissingTenantHeader_ReturnsBadRequest()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/menu/items");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private sealed record MenuItemDto(Guid id, string tenantId, string name, decimal price);
}
