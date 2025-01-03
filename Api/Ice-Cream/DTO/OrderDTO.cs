namespace Ice_Cream.DTO
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public string? Email { get; set; }
        public string? ContactDetails { get; set; }
        public string? Address { get; set; }
        public int? PaymentInfoId { get; set; }
        public int? AccountId { get; set; }
        public decimal? TotalAmount { get; set; }
        public DateTime? CreatedAt { get; set; }
        public List<OrderItemDTO> OrderItems { get; set; }
    }
}