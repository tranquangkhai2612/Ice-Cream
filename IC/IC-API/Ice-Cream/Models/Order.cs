using System.ComponentModel.DataAnnotations.Schema;

namespace Ice_Cream.Models
{
     [Table("Order")]
     public class Order 
     {
          public int Id { get; set;}
          public string? Email { get; set;}
          public string? ContactDetails { get; set;}
          public string? Address { get; set;}
          public int? PaymentId  { get; set;}
          public int? PaymentInfoId { get; set;} 
          public string? OrderType { get; set;}
          public int? OrderAmount { get; set;}
          public float? OrderPrice { get; set;}
          public DateTime? CreatedAt { get; set;}

     }
}    