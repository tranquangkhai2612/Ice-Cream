namespace Ice_Cream.DTOs
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public string? Email { get; set; }
        public string? ContactDetails { get; set; }
        public string? Address { get; set; }
        public string? OrderType { get; set; }
        public int? OrderAmount { get; set; }
        public float? OrderPrice { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}