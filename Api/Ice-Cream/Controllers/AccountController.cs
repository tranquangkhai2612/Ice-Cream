
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
        private readonly string Ice_Cream_React = "http://localhost:5173";
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
                CreateAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"),
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

            return Ok(new
            {
                message = "Login successful!",
                role = account.Role,
                username = account.Username,
                password = account.Password,
                email = account.Email,
                address = account.Address,
                supscriptionId = account.SubscriptionId,
                supscriptionStart = account.SubcriptionStart,
                supscriptionEnd = account.SubcriptionEnd,
                createdAt = account.CreateAt,
            });
        }
        [HttpPost("block-user")]
        public async Task<IActionResult> BlockUser([FromBody] BlockUserDto dto)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == dto.UserId);
            if (account == null)
            {
                return NotFound("User not found!");
            }

            if (account.Block == "true")
            {
                account.Block = "false";
            }else {
                account.Block = "true";
            }

            await _context.SaveChangesAsync();

            return Ok($"User has been {(account.Block == "true" ? "blocked" : "unblocked")} successfully!");

        }
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Accounts
                .Where(a => a.Role == "User")
                .OrderByDescending(a => a.CreateAt)
                .ToListAsync();

            if (!users.Any())
                return NotFound("No users found.");

            return Ok(users);
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPassword dto)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Email == dto.Email);
            if (account == null)
                return NotFound("Email not registered!");
            if(account.Active == "false")
                return NotFound("Account is not actived");

            // Tạo mã đặt lại mật khẩu
            var resetToken = Guid.NewGuid().ToString();
            account.Token = resetToken;
            account.TokenExpiry = DateTime.UtcNow.AddHours(1); 

            await _context.SaveChangesAsync();

            // Gửi email chứa liên kết đặt lại mật khẩu
            var resetLink = $"{Ice_Cream_React}/reset-password/{dto.Email}/{resetToken}";
            await SendEmailAsync(dto.Email, "Reset Password",
                $"Click the link to reset your password: {resetLink}");

            return Ok("Password reset link has been sent to your email.");
        }


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            Account? account = null;

            if (!string.IsNullOrEmpty(dto.Username) && !string.IsNullOrEmpty(dto.OldPassword))
            {
                account = await _context.Accounts.FirstOrDefaultAsync(a => a.Username == dto.Username);
                if (account == null || !BCrypt.Net.BCrypt.Verify(dto.OldPassword, account.Password))
                    return Unauthorized("Invalid username or password!");
            }
            else if (!string.IsNullOrEmpty(dto.Email) && !string.IsNullOrEmpty(dto.Token))
            {
                account = await _context.Accounts.FirstOrDefaultAsync(a => a.Email == dto.Email);
                if (account == null)
                    return NotFound("Account not found!");

                if (account.Token != dto.Token || account.TokenExpiry < DateTime.UtcNow)
                    return BadRequest("Invalid or expired token!");
            }
            else
            {
                return BadRequest("Invalid request. Provide either username and old password or email and token.");
            }

            account.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
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
