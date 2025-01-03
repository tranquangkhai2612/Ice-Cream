using Ice_Cream.DB;
using Ice_Cream.DTO;
using Ice_Cream.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;

namespace Ice_Cream.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FeedbackController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitFeedback([FromBody] FeedbackDTO feedbackDto)
        {
            // Validate input
            if (string.IsNullOrEmpty(feedbackDto.Email) ||
                string.IsNullOrEmpty(feedbackDto.FeedbackTitle) ||
                string.IsNullOrEmpty(feedbackDto.FeedbackDescription))
            {
                return BadRequest("Email, Feedback Title, and Feedback Description are required.");
            }

            // Check if the email has submitted feedback in the last 10 minutes
            var recentFeedback = await _context.Feadbacks
                .Where(f => f.FeedbackDate > DateTime.UtcNow.AddMinutes(-10) && f.Email == feedbackDto.Email)
                .FirstOrDefaultAsync();

            if (recentFeedback != null)
            {
                return BadRequest("You've already submitted feedback recently. Please wait before submitting again.");
            }

            // Map DTO to Entity
            var feedback = new Feedback
            {
                Email = feedbackDto.Email,
                FeedbackTitle = feedbackDto.FeedbackTitle,
                FeedbackDescription = feedbackDto.FeedbackDescription,
                FeedbackDate = DateTime.UtcNow // Automatically set the date
            };

            // Save to database
            _context.Feadbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return Ok("Feedback submitted successfully!");
        }

        // GET: api/feedback
        [HttpGet]
        public async Task<IActionResult> GetAllFeedbacks()
        {
            var feedbacks = await _context.Feadbacks
                .OrderByDescending(f => f.FeedbackDate) // Sort by latest feedback
                .ToListAsync();

            return Ok(feedbacks);
        }

        [HttpPut("{id}/answer")]
        public async Task<IActionResult> SubmitAnswer(int id, [FromBody] string answer)
        {
            var feedback = await _context.Feadbacks.FindAsync(id);

            if (feedback == null)
            {
                return NotFound("Feedback not found.");
            }

            feedback.Answer = answer;
            _context.Entry(feedback).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

                // Send email notification to the user
                await SendEmailAsync(feedback.Email, "Your Feedback Answered", $"Your feedback titled \"{feedback.FeedbackTitle}\" has been answered:\n\n{answer}");

                return Ok("Answer updated successfully, and email sent to the user.");
            }
            catch (DbUpdateException)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the answer.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while sending the email: {ex.Message}");
            }
        }

        private async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("Admin", "phanthanhtam618678@gmail.com"));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;
            email.Body = new TextPart("plain") { Text = body };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync("phanthanhtam618678@gmail.com", "ayod njma ioim dgaz");
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeedback(int id)
        {
            // Find the feedback by ID
            var feedback = await _context.Feadbacks.FindAsync(id);

            if (feedback == null)
            {
                return NotFound("Feedback not found.");
            }

            // Remove the feedback
            _context.Feadbacks.Remove(feedback);

            try
            {
                await _context.SaveChangesAsync();
                return Ok("Feedback deleted successfully.");
            }
            catch (DbUpdateException)
            {
                // Log exception if necessary
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the feedback.");
            }
        }


    }

}
