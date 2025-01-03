using Ice_Cream.Models;

public class PaymentInfo
{
     public int Id { get; set; }
     public int? AccountId { get; set; }
     public int? OrderId { get; set; }
     public virtual Order Order { get; set; }
     public string? TransactionId { get; set; }
     public decimal? Amount { get; set; }
     public string? Currency { get; set; }
     public string? Status { get; set; }
     public DateTime? CreatedAt { get; set; }

     // public virtual Account Account { get; set; }
     
}