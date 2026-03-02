using System;

namespace QuickServe.Core.Entities
{
    /// <summary>
    /// Application user — merchants and admins. NOT a tenant entity since
    /// users exist at the platform level (a user owns/belongs to a tenant).
    /// </summary>
    public class AppUser
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Merchant"; // Merchant | Admin
        public Guid? TenantId { get; set; } // Links user to their restaurant
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
