using System;
using System.Threading.Tasks;

namespace QuickServe.Core.Interfaces
{
    public interface INotificationService
    {
        Task SendOrderCreatedNotification(Guid orderId, string recipient);
        Task SendOrderPreparingNotification(Guid orderId, string recipient);
        Task SendOrderReadyNotification(Guid orderId, string recipient);
    }
}
