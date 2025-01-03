namespace Ice_Cream.DTO
{
     public class OrderItemDTO
     {
          public int Id { get; set; }
          public int? SubscriptionId { get; set; }
          public int? BookId { get; set; }
          public int Quantity { get; set; }
          public int? OrderId { get; set; }
          public decimal? OrderPrice { get; set; }
          public SubscriptionDTO? Subscription { get; set; }
          public BookDTO? Book { get; set; }
          
     }
}