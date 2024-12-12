namespace Ice_Cream.Models
{
    public class Recipe
    {
        public int Id { get; set; }
        public string RecipeName { get; set; }
        public DateTime? RecipeDate { get; set; }
        public string RecipeDescription { get; set; }
        public string RecipeSteps { get; set; }
        public string RecipeIngredient { get; set; }
        public string RecipeProcedures { get; set; }
        public string RecipeThumbnail { get; set; }
        public string RecipeImage { get; set; }
        public bool? RecipeRequireSubscription { get; set; }
        public int? CommentId { get; set; }
        public int? RatingId { get; set; }
        public virtual Comments? Comment { get; set; }
        public virtual Rating? Rating { get; set; }
        public virtual ICollection<FAQ>? FAQs { get; set; }
    }
}
