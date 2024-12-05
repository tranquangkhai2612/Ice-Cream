namespace Ice_Cream.Models
{
    public class Account
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }
        public string? SubscriptionId { get; set; }
        public string? Role { get; set; }
        public string? contactDetails { get; set; }
        public string? Address { get; set; }
        public string Active { get; set; } = "false";
        public string Block { get; set; } = "false";
        public string? SubcriptionStart { get; set; }
        public string? SubcriptionEnd { get; set; }
        public string? CreateAt { get; set; }
    }
}
