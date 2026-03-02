using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuickServe.Core.Interfaces;

namespace QuickServe.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _menuService;

        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetMenu()
        {
            try
            {
                var menu = await _menuService.GetActiveMenuAsync();
                return Ok(menu);
            }
            catch (System.Collections.Generic.KeyNotFoundException)
            {
                return NotFound(new { Message = "No active menu found." });
            }
        }

        public class CreateMenuRequest { public string Title { get; set; } = string.Empty; public string? Description { get; set; } }
        [HttpPost]
        public async Task<IActionResult> CreateMenu([FromBody] CreateMenuRequest request)
        {
            var menu = await _menuService.CreateMenuAsync(request.Title, request.Description);
            return Ok(menu);
        }

        public class CreateCategoryRequest { public string Name { get; set; } = string.Empty; public string? Description { get; set; } public int SortOrder { get; set; } }
        [HttpPost("{menuId}/categories")]
        public async Task<IActionResult> AddCategory(Guid menuId, [FromBody] CreateCategoryRequest request)
        {
            var category = await _menuService.AddCategoryAsync(menuId, request.Name, request.Description, request.SortOrder);
            return Ok(category);
        }

        public class CreateItemRequest { public string Name { get; set; } = string.Empty; public string? Description { get; set; } public decimal Price { get; set; } }
        [HttpPost("categories/{categoryId}/items")]
        public async Task<IActionResult> AddItem(Guid categoryId, [FromBody] CreateItemRequest request)
        {
            var item = await _menuService.AddItemAsync(categoryId, request.Name, request.Description, request.Price);
            return Ok(item);
        }
    }
}
