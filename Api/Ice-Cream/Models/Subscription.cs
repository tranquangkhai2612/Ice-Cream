using System.ComponentModel.DataAnnotations;

namespace Ice_Cream.Models
{
    public class Subscription
    {
        [Key]
        public int Id { get; set; }
        public string? SubType { get; set; }
        public string? SubDescription { get; set; }
        public decimal? SubPrice { get; set; }
        // public virtual Order Order { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }

}
