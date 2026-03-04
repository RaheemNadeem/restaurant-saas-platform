using Stripe;
using Microsoft.Extensions.Configuration;
using QuickServe.Core.Entities;
using QuickServe.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Order = QuickServe.Core.Entities.Order;

namespace QuickServe.API.Services
{
    public interface IPaymentService
    {
        Task<PaymentIntent> CreatePaymentIntentAsync(Order order);
        Task<bool> HandlePaymentSuccessAsync(string paymentIntentId);
    }

    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public PaymentService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            
            StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"] 
                ?? Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY")
                ?? "sk_test_mock_sandbox_key";
        }

        public async Task<PaymentIntent> CreatePaymentIntentAsync(Order order)
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(order.Total * 100), // Stripe uses cents
                Currency = "usd",
                Metadata = new Dictionary<string, string>
                {
                    { "OrderId", order.Id.ToString() },
                    { "OrderNumber", order.OrderNumber }
                }
            };

            var service = new PaymentIntentService();
            return await service.CreateAsync(options);
        }

        public async Task<bool> HandlePaymentSuccessAsync(string paymentIntentId)
        {
            // Specifically handling Idempotency
            var service = new PaymentIntentService();
            var paymentIntent = await service.GetAsync(paymentIntentId);

            if (paymentIntent.Status == "succeeded" && paymentIntent.Metadata.ContainsKey("OrderId"))
            {
                var orderIdStr = paymentIntent.Metadata["OrderId"];
                if (Guid.TryParse(orderIdStr, out var orderId))
                {
                    var order = await _context.Orders.FindAsync(orderId);
                    
                    // Only transition if the order is still "Created" to prevent duplicating notifications
                    if (order != null && order.Status == "Created")
                    {
                        order.Status = "Paid";
                        _context.Entry(order).State = EntityState.Modified;
                        await _context.SaveChangesAsync();
                        return true;
                    }
                }
            }

            return false;
        }
    }
}
