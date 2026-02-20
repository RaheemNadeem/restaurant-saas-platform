using System.Collections.Concurrent;

namespace Api.Modules.Menu;

public interface IMenuRepository
{
    IReadOnlyCollection<MenuItem> GetForTenant(string tenantId);
    MenuItem Create(string tenantId, string name, decimal price);
    bool Update(string tenantId, Guid id, string name, decimal price);
}

public sealed class InMemoryMenuRepository : IMenuRepository
{
    private readonly ConcurrentDictionary<string, List<MenuItem>> _store = new();

    public IReadOnlyCollection<MenuItem> GetForTenant(string tenantId)
    {
        return _store.TryGetValue(tenantId, out var items)
            ? items.OrderBy(x => x.Name).ToList()
            : [];
    }

    public MenuItem Create(string tenantId, string name, decimal price)
    {
        var item = new MenuItem(Guid.NewGuid(), tenantId, name, price);
        var tenantList = _store.GetOrAdd(tenantId, _ => []);
        lock (tenantList)
        {
            tenantList.Add(item);
        }

        return item;
    }

    public bool Update(string tenantId, Guid id, string name, decimal price)
    {
        if (!_store.TryGetValue(tenantId, out var items)) return false;

        lock (items)
        {
            var idx = items.FindIndex(x => x.Id == id);
            if (idx < 0) return false;
            items[idx] = items[idx] with { Name = name, Price = price };
            return true;
        }
    }
}
