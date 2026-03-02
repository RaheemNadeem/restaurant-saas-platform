using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QuickServe.Core.Entities;
using QuickServe.Core.Interfaces;
using QuickServe.Infrastructure.Data;

namespace QuickServe.API.Services
{
    public class MenuService : IMenuService
    {
        private readonly ApplicationDbContext _context;

        public MenuService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Menu> GetActiveMenuAsync()
        {
            return await _context.Menus
                .Include(m => m.Categories)
                    .ThenInclude(c => c.Items)
                .FirstOrDefaultAsync(m => m.IsActive)
                ?? throw new KeyNotFoundException("No active menu found for this tenant.");
        }

        public async Task<Menu> CreateMenuAsync(string title, string? description)
        {
            var menu = new Menu
            {
                Title = title,
                Description = description,
                IsActive = true
            };

            await _context.Menus.AddAsync(menu);
            await _context.SaveChangesAsync();
            return menu;
        }

        public async Task<MenuCategory> AddCategoryAsync(Guid menuId, string name, string? description, int sortOrder)
        {
            var category = new MenuCategory
            {
                MenuId = menuId,
                Name = name,
                Description = description,
                SortOrder = sortOrder
            };

            await _context.MenuCategories.AddAsync(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<MenuItem> AddItemAsync(Guid categoryId, string name, string? description, decimal price)
        {
            var item = new MenuItem
            {
                MenuCategoryId = categoryId,
                Name = name,
                Description = description,
                Price = price,
                IsAvailable = true
            };

            await _context.MenuItems.AddAsync(item);
            await _context.SaveChangesAsync();
            return item;
        }
    }
}
