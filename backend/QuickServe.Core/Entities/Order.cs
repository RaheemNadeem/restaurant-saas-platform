using System;
using System.Collections.Generic;

namespace QuickServe.Core.Entities
{
    public class Order : TenantEntity
    {
        public string OrderNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public decimal Subtotal { get; set; }
        public decimal Discount { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; } = "Created"; // Created, Preparing, Ready, Completed, Cancelled
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<OrderItem> Items { get; set; } = new();
    }

    public class OrderItem : BaseEntity
    {
        public Guid OrderId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
