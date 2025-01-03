namespace Ice_Cream.DTO
{
    public class CreateBookFormDTO
    {
        public string? BookName { get; set; }
        public string? BookDescription { get; set; }
        public float? Price { get; set; }
        public IFormFile? BookImage { get; set; }
    }
}
