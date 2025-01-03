namespace Ice_Cream.DTO
{
    public class UpdateRecipeDTO
    {
        public int Id { get; set; }
        public string? RecipeName { get; set; }
        public string? RecipeDescription { get; set; }
        public string? RecipeSteps { get; set; }
        public string? RecipeIngredient { get; set; }
        public string? RecipeProcedures { get; set; }
        public string? RecipeThumbnail { get; set; }
        public string? RecipeImage { get; set; }
        public bool RecipeRequireSubscription { get; set; }
    }
}
