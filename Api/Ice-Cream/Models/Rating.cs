namespace Ice_Cream.Models
{
    public class Rating
    {
        public int Id { get; set; }
        public int? RecipeId { get; set; }
        public int? AccountId { get; set; }
        public float? Value { get; set; }
        public DateTime? CreatedAt { get; set; }
        public virtual Recipe Recipe { get; set; }
        public virtual Account Account { get; set; }
        public virtual ICollection<Recipe> Recipes { get; set; }
    }
}
