using Ice_Cream.DB;
using Ice_Cream.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ice_Cream.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SubscriptionController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/subscription
        [HttpPost]
        public async Task<IActionResult> CreateSubscription([FromBody] Subscription subscription)
        {
            if (string.IsNullOrEmpty(subscription.SubType) ||
                string.IsNullOrEmpty(subscription.SubDescription) ||
                string.IsNullOrEmpty(subscription.SubPrice))
            {
                return BadRequest("Subscription Type, Description, and Price are required.");
            }

            // Add the subscription
            _context.Subscriptions.Add(subscription);

            try
            {
                await _context.SaveChangesAsync();
                return Ok("Subscription created successfully!");
            }
            catch (DbUpdateException)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the subscription.");
            }
        }

        // DELETE: api/subscription/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubscription(int id)
        {
            var subscription = await _context.Subscriptions.FindAsync(id);

            if (subscription == null)
            {
                return NotFound("Subscription not found.");
            }

            // Remove the subscription
            _context.Subscriptions.Remove(subscription);

            try
            {
                await _context.SaveChangesAsync();
                return Ok("Subscription deleted successfully.");
            }
            catch (DbUpdateException)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the subscription.");
            }
        }

        // GET: api/subscription
        [HttpGet]
        public async Task<IActionResult> GetAllSubscriptions()
        {
            try
            {
                var subscriptions = await _context.Subscriptions.ToListAsync();
                return Ok(subscriptions);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving subscriptions.");
            }
        }
    }
}
