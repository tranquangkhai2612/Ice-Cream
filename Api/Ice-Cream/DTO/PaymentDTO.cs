namespace Ice_Cream.DTO
{
     public class PaymentDTO
     {

          public int Id { get; set; }
          public string? TransactionId { get; set; }
          public int? AccountId { get; set; }
          public decimal? Amount { get; set; }
          public string? Currency { get; set; }
          public string? Status { get; set; }
          public DateTime? CreatedAt { get; set; }
          public int? OrderId { get; set; }
     }
}