using System;

namespace QuickServe.Core.Entities
{
    /// <summary>
    /// Payment / payout configuration for a tenant (Onboarding Step 4).
    /// </summary>
    public class PaymentConfig : BaseEntity
    {
        public Guid TenantId { get; set; }
        public string LegalName { get; set; } = string.Empty;
        public string TaxId { get; set; } = string.Empty;
        public string BankAccountLast4 { get; set; } = string.Empty;
        public string PayoutSchedule { get; set; } = "Daily"; // Daily | Weekly | Monthly
        public bool IsVerified { get; set; } = false;
    }
}
