using System;
using System.Threading.Tasks;
using QuickServe.Core.Entities;
using QuickServe.Core.Interfaces;
using QuickServe.Infrastructure.Data;

namespace QuickServe.Infrastructure.Services
{
    public class LoggingNotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;

        public LoggingNotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SendOrderCreatedNotification(Guid orderId, string recipient)
        {
            var message = $"Order {orderId} has been created successfully!";
            await LogNotification(recipient, message, NotificationType.OrderCreated);
        }

        public async Task SendOrderPreparingNotification(Guid orderId, string recipient)
        {
            var message = $"Your order {orderId} is now being prepared.";
            await LogNotification(recipient, message, NotificationType.OrderPreparing);
        }

        public async Task SendOrderReadyNotification(Guid orderId, string recipient)
        {
            var message = $"Your order {orderId} is ready for pickup!";
            await LogNotification(recipient, message, NotificationType.OrderReady);
        }

        private async Task LogNotification(string recipient, string message, NotificationType type)
        {
            var log = new NotificationLog
            {
                Recipient = recipient,
                Message = message,
                Type = type,
                Status = NotificationStatus.Sent // For now, we simulate immediate "delivery"
            };

            _context.NotificationLogs.Add(log);
            await _context.SaveChangesAsync();

            // Also log to console for visibility during dev
            Console.WriteLine($"[NOTIFICATION SENT] To: {recipient}, Type: {type}, Msg: {message}");
        }
    }
}
