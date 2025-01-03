namespace Ice_Cream.DTO
{
    public class CreateRecipeFormDTO
    {
        public string? RecipeName { get; set; }
        public string? RecipeDescription { get; set; }
        public string? RecipeSteps { get; set; }
        public string? RecipeIngredient { get; set; }
        public string? RecipeProcedures { get; set; }
        public IFormFile? RecipeThumbnail { get; set; }
        public ICollection<IFormFile>? RecipeImage { get; set; }
        public bool RecipeRequireSubscription { get; set; } = false;
    }
}
