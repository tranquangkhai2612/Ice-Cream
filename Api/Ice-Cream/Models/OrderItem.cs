using System.ComponentModel.DataAnnotations.Schema;

namespace Ice_Cream.Models{
     public class OrderItem 
     {
          public int Id { get; set; }
          [ForeignKey("Order")]
          public int? OrderId { get; set; }
          public virtual Order Order { get; set; }

          // Foreign keys to other entities
          public int? SubscriptionId { get; set; }
          public int? BookId { get; set; }

          public int Quantity { get; set; }
          public decimal? OrderPrice { get; set; }
          public virtual Subscription Subscription { get; set; }
          public virtual Book Book { get; set; }
     }
}
