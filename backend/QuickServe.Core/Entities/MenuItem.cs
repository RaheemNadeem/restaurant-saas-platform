using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuickServe.Core.Entities
{
    public class MenuItem : TenantEntity
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public bool IsAvailable { get; set; } = true;

        public Guid MenuCategoryId { get; set; }
        public MenuCategory? Category { get; set; }
    }
}
