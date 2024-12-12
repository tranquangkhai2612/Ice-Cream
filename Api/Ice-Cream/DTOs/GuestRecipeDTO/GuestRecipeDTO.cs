namespace Ice_Cream.DTOs.GustRecipeDTO
{
    public class GuestRecipeDTO
    {
        public int Id { get; set; }
        public string RecipeName { get; set; }
        public DateTime? RecipeDate { get; set; }
        public string RecipeDescription { get; set; }
        public string RecipeThumbnail { get; set; }
        public string RecipeImage { get; set; }
        public bool? RecipeRequireSubscription { get; set; }
        public double? AverageRating { get; set; }
        public int? CommentsCount { get; set; }
    }
}
