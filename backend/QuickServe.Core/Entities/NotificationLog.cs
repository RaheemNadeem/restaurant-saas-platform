using System;
using System.ComponentModel.DataAnnotations;

namespace QuickServe.Core.Entities
{
    public class NotificationLog : TenantEntity
    {
        [Required]
        public string Recipient { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        public NotificationType Type { get; set; }

        public NotificationStatus Status { get; set; }

        public string? ErrorMessage { get; set; }
    }

    public enum NotificationType
    {
        OrderCreated,
        OrderPreparing,
        OrderReady,
        PromotionAlert
    }

    public enum NotificationStatus
    {
        Pending,
        Sent,
        Failed
    }
}
