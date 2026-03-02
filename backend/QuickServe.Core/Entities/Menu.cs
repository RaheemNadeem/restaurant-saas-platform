using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace QuickServe.Core.Entities
{
    public class Menu : TenantEntity
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        public ICollection<MenuCategory> Categories { get; set; } = new List<MenuCategory>();
    }
}
