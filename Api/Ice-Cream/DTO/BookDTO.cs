namespace Ice_Cream.DTO
{
    public class BookDTO
    {
        public int Id { get; set; }
        public string? BookName { get; set; }
        public DateTime? BookDate { get; set; }
        public string? BookDescription { get; set; }
        public decimal? Price { get; set; }
        public string? BookImage { get; set; }
    }
}
