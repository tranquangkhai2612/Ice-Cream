namespace Ice_Cream.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string? BookName { get; set; }
        public DateTime? BookDate { get; set; }
        public string? BookDescription { get; set; }
        public decimal? Price { get; set; }
        public string? BookImage { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        // public virtual Order Order { get; set; }
    }
}
