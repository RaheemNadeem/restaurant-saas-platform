using System;
using System.ComponentModel.DataAnnotations;

namespace QuickServe.Core.Entities
{
    public class Coupon : TenantEntity
    {
        [Required]
        [MaxLength(50)]
        public string Code { get; set; } = string.Empty;

        public DiscountType Type { get; set; }

        public decimal DiscountValue { get; set; }

        public int MaxUses { get; set; }

        public int CurrentUses { get; set; }

        public DateTime? ValidUntil { get; set; }

        public bool IsActive => ValidUntil == null || ValidUntil > DateTime.UtcNow;
    }

    public enum DiscountType
    {
        Percent,
        FixedAmount
    }
}
