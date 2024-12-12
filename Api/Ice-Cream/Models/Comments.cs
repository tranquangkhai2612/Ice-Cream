namespace Ice_Cream.Models
{
    public class Comments
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? AccountId { get; set; }
        public virtual Account Account { get; set; }
        public virtual ICollection<Recipe> Recipes { get; set; }
    }
}
