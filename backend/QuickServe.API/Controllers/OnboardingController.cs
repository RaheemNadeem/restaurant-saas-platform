using Microsoft.AspNetCore.Mvc;

namespace QuickServe.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OnboardingController : ControllerBase
    {
        [HttpPost("wizard/profile")]
        public IActionResult UpdateProfile()
        {
            // TODO: Save onboarding profile data
            return Ok(new { Message = "Profile updated placeholder." });
        }

        [HttpPost("wizard/menu")]
        public IActionResult UploadInitialMenu()
        {
            // TODO: Process initial static menu payload
            return Ok(new { Message = "Initial menu parsed placeholder." });
        }

        [HttpPost("wizard/payments")]
        public IActionResult SavePaymentDetails()
        {
            // TODO: Process Stripe Connect details
            return Ok(new { Message = "Payment details saved placeholder." });
        }
    }
}
