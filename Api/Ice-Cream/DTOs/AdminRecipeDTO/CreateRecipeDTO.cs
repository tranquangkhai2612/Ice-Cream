namespace Ice_Cream.DTOs.AdminRecipeDTO
{
    public class CreateRecipeDTO
    {
        public string RecipeName { get; set; }
        public string RecipeDescription { get; set; }
        public string RecipeSteps { get; set; }
        public string RecipeIngredient { get; set; }
        public string RecipeProcedures { get; set; }
        public string RecipeThumbnail { get; set; }
        public string RecipeImage { get; set; }
        public bool? RecipeRequireSubscription { get; set; }
    }
}
