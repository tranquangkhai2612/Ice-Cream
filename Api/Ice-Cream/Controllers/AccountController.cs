using Ice_Cream.DB;
using Ice_Cream.DTO;
using Ice_Cream.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MailKit.Security;
using MimeKit;
using MailKit.Net.Smtp;
namespace Ice_Cream.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AccountController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            if (await _context.Accounts.AnyAsync(a => a.Username == registerDto.Username))
                return BadRequest("Username already exists!");

            var newAccount = new Account
            {
                Username = registerDto.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Email = registerDto.Email,
                Address = registerDto.Address,
                Role = "User", 
                Active = "false",
                Block = "false",
                CreateAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"),
                SubcriptionStart = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"), 
                SubcriptionEnd = DateTime.UtcNow.AddMonths(1).ToString("yyyy-MM-dd HH:mm:ss") 
            };


            await _context.Accounts.AddAsync(newAccount);
            await _context.SaveChangesAsync();
            var verificationToken = Guid.NewGuid().ToString();

            HttpContext.Session.SetString(registerDto.Email, verificationToken);

            var verificationLink 
                = $"http://localhost:5099/api/account/verify-email?email={registerDto.Email}&token={verificationToken}";

            await SendEmailAsync(registerDto.Email, "Email Verification",
                $"Click the link to verify your account: {verificationLink}");

            return Ok("Registration successful! Please check your email to verify your account.");
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Username == loginDto.Username);

            if (account == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, account.Password))
                return Unauthorized("Invalid username or password!");

            if (account.Active != "true" || account.Block != "false")
                return Unauthorized("Account is either inactive or blocked!");

            return Ok(new { message = "Login successful!" });
        }
        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail(string email, string token)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Email == email);
            if (account == null)
                return NotFound("Account not found!");
            var storedToken = HttpContext.Session.GetString(email);
            if (storedToken == null || storedToken != token)
                return BadRequest("Invalid or expired verification link!");
            account.Active = "true";
            await _context.SaveChangesAsync();

            return Ok("Your account has been successfully verified!");
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Email == email);
            if (account == null)
                return NotFound("Email not registered!");
            var newPassword = GenerateRandomPassword(6);
            account.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _context.SaveChangesAsync();
            await SendEmailAsync(email, "Reset Password", $"Your new password is: {newPassword}");

            return Ok("New password sent to your email.");
        }

        private string GenerateRandomPassword(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, length).Select(s => s[new Random().Next(s.Length)]).ToArray());
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
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(string username, string oldPassword, string newPassword)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Username == username);

            if (account == null || !BCrypt.Net.BCrypt.Verify(oldPassword, account.Password))
                return Unauthorized("Invalid username or password!");

            account.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);

            await _context.SaveChangesAsync();

            return Ok("Password changed successfully!");
        }


    }

}
