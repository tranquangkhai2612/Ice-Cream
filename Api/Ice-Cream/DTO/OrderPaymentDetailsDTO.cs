using Ice_Cream.DTO;

public class OrderPaymentDetailsDTO
{
     public int OrderId { get; set; }
     public string? Email { get; set; }
     public string? Address { get; set; }
     public decimal TotalAmount { get; set; }
     public int AccountId { get; set; }
     public DateTime CreatedAt { get; set; }
     public PaymentDTO? PaymentInfo { get; set; }
     public List<OrderItemDTO>? OrderItems { get; set; }
}