namespace Ice_Cream.Models
{
    public class Recipe
    {
        public int Id { get; set; }
        public string? RecipeName { get; set; }
        public DateTime? RecipeDate { get; set; }
        public string? RecipeDescription { get; set; }
        public string? RecipeSteps { get; set; }
        public string? RecipeIngredient { get; set; }
        public string? RecipeProcedures { get; set; }
        public string? RecipeThumbnail { get; set; }
        public string? RecipeImage { get; set; } //multi image
        public bool? RecipeRequireSubscription { get; set; }
    }
}
