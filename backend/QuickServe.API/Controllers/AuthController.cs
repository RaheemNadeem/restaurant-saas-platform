using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QuickServe.Core.Entities;
using QuickServe.Infrastructure.Data;

namespace QuickServe.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        /// <summary>
        /// Registers a new merchant account and creates a Tenant (restaurant) record.
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest(new { message = "Email and password are required." });

            var existing = await _context.Users
                .IgnoreQueryFilters()
                .AnyAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (existing)
                return Conflict(new { message = "An account with that email already exists." });

            // 1. Create the Tenant (restaurant) record
            var tenant = new Tenant
            {
                RestaurantName = request.RestaurantName ?? "My Restaurant",
                Slug = GenerateSlug(request.RestaurantName ?? request.Email),
                OwnerId = Guid.Empty // Will be set after user creation
            };
            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync();

            // 2. Create the user linked to the tenant
            var user = new AppUser
            {
                Id = Guid.NewGuid(),
                Email = request.Email.ToLower(),
                Name = request.Name ?? request.Email,
                PasswordHash = HashPassword(request.Password),
                Role = "Merchant",
                TenantId = tenant.Id,
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);

            // Update tenant owner reference
            tenant.OwnerId = user.Id;
            await _context.SaveChangesAsync();

            var token = GenerateJwt(user);
            return Ok(new
            {
                message = "Account created successfully.",
                token,
                userId = user.Id,
                name = user.Name,
                role = user.Role,
                tenantId = user.TenantId,
                expiresIn = 3600
            });
        }

        /// <summary>
        /// Authenticates a merchant and returns a signed JWT with tenant context.
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest(new { message = "Email and password are required." });

            var user = await _context.Users
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(u => u.Email == request.Email.ToLower());

            if (user == null || user.PasswordHash != HashPassword(request.Password))
                return Unauthorized(new { message = "Invalid email or password." });

            var token = GenerateJwt(user);
            return Ok(new
            {
                token,
                userId = user.Id,
                name = user.Name,
                role = user.Role,
                tenantId = user.TenantId,
                expiresIn = 3600
            });
        }

        private string GenerateJwt(AppUser user)
        {
            var jwtKey = _config["Jwt:Key"]
                ?? Environment.GetEnvironmentVariable("JWT_KEY")
                ?? throw new InvalidOperationException("JWT signing key not configured.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new(JwtRegisteredClaimNames.Email, user.Email),
                new("name", user.Name),
                new(ClaimTypes.Role, user.Role),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Include tenantId so TenantProvider can scope all DB queries
            if (user.TenantId.HasValue)
                claims.Add(new Claim("tenantId", user.TenantId.Value.ToString()));

            var token = new JwtSecurityToken(
                issuer: "QuickServe",
                audience: "QuickServe",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string HashPassword(string password)
        {
            using var sha = System.Security.Cryptography.SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToHexString(hash);
        }

        private static string GenerateSlug(string name)
        {
            var slug = name.ToLowerInvariant();
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            slug = Regex.Replace(slug, @"\s+", "-");
            slug = slug.Trim('-');
            return string.IsNullOrEmpty(slug) ? "restaurant" : slug;
        }
    }

    public class RegisterRequest
    {
        public string? Name { get; set; }
        public string? RestaurantName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
