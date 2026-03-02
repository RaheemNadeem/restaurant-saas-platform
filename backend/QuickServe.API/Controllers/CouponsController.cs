using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickServe.Core.Entities;
using QuickServe.Infrastructure.Data;

namespace QuickServe.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CouponsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CouponsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCoupons()
        {
            var coupons = await _context.Coupons.ToListAsync();
            return Ok(coupons);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCoupon(Guid id)
        {
            var coupon = await _context.Coupons.FindAsync(id);

            if (coupon == null)
            {
                return NotFound();
            }

            return Ok(coupon);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCoupon(Coupon coupon)
        {
            _context.Coupons.Add(coupon);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCoupon), new { id = coupon.Id }, coupon);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCoupon(Guid id, Coupon updatedCoupon)
        {
            if (id != updatedCoupon.Id)
            {
                return BadRequest();
            }

            _context.Entry(updatedCoupon).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CouponExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoupon(Guid id)
        {
            var coupon = await _context.Coupons.FindAsync(id);
            if (coupon == null)
            {
                return NotFound();
            }

            _context.Coupons.Remove(coupon);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CouponExists(Guid id)
        {
            return _context.Coupons.Any(e => e.Id == id);
        }
    }
}
