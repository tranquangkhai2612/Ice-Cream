using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
namespace Ice_Cream.Models
{
     [Table("Order")]
     public class Order
     {
          public int Id { get; set; }
          public string? Email { get; set; }
          public string? ContactDetails { get; set; }
          public string? Address { get; set; }
          public virtual PaymentInfo PaymentInfo { get; set; }
          public int? AccountId { get; set; }
          public virtual Account Account { get; set; }
          public decimal TotalAmount { get; set; }
          public DateTime? CreatedAt { get; set; }
          public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
     }
}
