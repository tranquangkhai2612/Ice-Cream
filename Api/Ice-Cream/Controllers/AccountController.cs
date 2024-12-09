
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

        private readonly string Ice_Cream_HostAddress = "http://localhost:5099";
        public AccountController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            if (await _context.Accounts.AnyAsync(a => a.Username == registerDto.Username))
                return BadRequest("Username already exists!");

            if (await _context.Accounts.AnyAsync(a => a.Email == registerDto.Email))
                return BadRequest("Email already exists!");

            // Tạo mã xác thực
            var verificationToken = Guid.NewGuid().ToString();

            var newAccount = new Account
            {
                Username = registerDto.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Email = registerDto.Email,
                Address = registerDto.Address,
                Role = "User",
                Active = "false",
                Block = "false",
                //CreateAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"),
                //SubcriptionStart = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"),
                //SubcriptionEnd = DateTime.UtcNow.AddMonths(1).ToString("yyyy-MM-dd HH:mm:ss"),
                Token = verificationToken, 
                TokenExpiry = DateTime.UtcNow.AddHours(1)
            };

            await _context.Accounts.AddAsync(newAccount);
            await _context.SaveChangesAsync();

            // Gửi email xác thực
            var verificationLink = 
                $"{Ice_Cream_HostAddress}/api/account/verify-email?email={registerDto.Email}&token={verificationToken}";
            await SendEmailAsync(registerDto.Email, "Email Verification",
                $"Click the link to verify your account: {verificationLink}");

            return Ok("Registration successful! Please check your email to verify your account.");
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail(string email, string token)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Email == email);
            if (account == null)
                return NotFound("Account not found!");

            // Kiểm tra mã token và thời hạn hiệu lực
            if (account.Token != token || account.TokenExpiry < DateTime.UtcNow)
                return BadRequest("Invalid or expired verification link!");

            // Xác thực tài khoản
            account.Active = "true";
            account.Token = null; // Xóa mã token sau khi xác thực thành công
            account.TokenExpiry = null;

            await _context.SaveChangesAsync();

            return Ok("Your account has been successfully verified!");
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

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Email == email);
            if (account == null)
                return NotFound("Email not registered!");

            // Tạo mã đặt lại mật khẩu
            var resetToken = Guid.NewGuid().ToString();
            account.Token = resetToken;
            account.TokenExpiry = DateTime.UtcNow.AddHours(1); 

            await _context.SaveChangesAsync();

            // Gửi email chứa liên kết đặt lại mật khẩu
            var resetLink = $"{Ice_Cream_HostAddress}/api/account/reset-password?email={email}&token={resetToken}";
            await SendEmailAsync(email, "Reset Password",
                $"Click the link to reset your password: {resetLink}");

            return Ok("Password reset link has been sent to your email.");
        }


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(string email, string token, string newPassword)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Email == email);
            if (account == null)
                return NotFound("Account not found!");

            // Kiểm tra mã token và thời hạn hiệu lực
            if (account.Token != token || account.TokenExpiry < DateTime.UtcNow)
                return BadRequest("Invalid or expired token!");

            // Đặt lại mật khẩu
            account.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);

            // Xóa token sau khi sử dụng
            account.Token = null;
            account.TokenExpiry = null;

            await _context.SaveChangesAsync();

            return Ok("Password has been reset successfully!");
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

    }

}
