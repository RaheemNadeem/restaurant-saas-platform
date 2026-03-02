using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace QuickServe.Core.Entities
{
    public class MenuCategory : TenantEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(250)]
        public string? Description { get; set; }

        public int SortOrder { get; set; }

        public Guid MenuId { get; set; }
        public Menu? Menu { get; set; }

        public ICollection<MenuItem> Items { get; set; } = new List<MenuItem>();
    }
}
