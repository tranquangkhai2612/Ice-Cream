namespace Ice_Cream.DTO
{
    public class ResetPasswordDto
    {
        public string? Username { get; set; }
        public string? OldPassword { get; set; }
        public string? Email { get; set; }
        public string? Token { get; set; }
        public string NewPassword { get; set; }
    }
}
