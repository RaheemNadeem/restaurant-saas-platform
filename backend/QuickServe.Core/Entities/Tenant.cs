using System;
using System.Collections.Generic;

namespace QuickServe.Core.Entities
{
    /// <summary>
    /// Represents a restaurant on the platform.
    /// This IS the tenant record — NOT a TenantEntity itself.
    /// All tenant-scoped data (menus, orders, coupons) references this via TenantId.
    /// </summary>
    public class Tenant : BaseEntity
    {
        public Guid OwnerId { get; set; }

        // Business info (Onboarding Step 1)
        public string RestaurantName { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty; // URL-safe name
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string RestaurantType { get; set; } = "Fast Casual";

        // Branding (Onboarding Step 2)
        public string? LogoUrl { get; set; }
        public string PrimaryColor { get; set; } = "#BF4444";
        public string Typography { get; set; } = "Inter";
        public string? Description { get; set; }

        // Status
        public bool IsPublished { get; set; } = false;
        public bool OnboardingComplete { get; set; } = false;

        // Navigation
        public List<OperatingHours> Hours { get; set; } = new();
        public PaymentConfig? PaymentConfig { get; set; }
    }
}
