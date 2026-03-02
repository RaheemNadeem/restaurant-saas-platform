using System;

namespace QuickServe.Core.Entities
{
    /// <summary>
    /// Store hours for a single day of the week.
    /// </summary>
    public class OperatingHours : BaseEntity
    {
        public Guid TenantId { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public TimeSpan OpenTime { get; set; } = new(9, 0, 0);   // 09:00
        public TimeSpan CloseTime { get; set; } = new(21, 0, 0); // 21:00
        public bool IsClosed { get; set; } = false;
    }
}
