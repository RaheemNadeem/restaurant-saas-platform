using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using QuickServe.Core.Entities;

namespace QuickServe.Core.Interfaces
{
    public interface IMenuService
    {
        Task<Menu> GetActiveMenuAsync();
        Task<Menu> CreateMenuAsync(string title, string? description);
        Task<MenuCategory> AddCategoryAsync(Guid menuId, string name, string? description, int sortOrder);
        Task<MenuItem> AddItemAsync(Guid categoryId, string name, string? description, decimal price);
    }
}
