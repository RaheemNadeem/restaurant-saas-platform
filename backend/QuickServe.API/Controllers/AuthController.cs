using Microsoft.AspNetCore.Mvc;

namespace QuickServe.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login()
        {
            // TODO: Implement actual authentication
            return Ok(new { Token = "dummy-token-123" });
        }

        [HttpPost("signup")]
        public IActionResult Signup()
        {
            // TODO: Implement owner registration
            return Ok(new { Message = "Registration placeholder successful." });
        }
    }
}
