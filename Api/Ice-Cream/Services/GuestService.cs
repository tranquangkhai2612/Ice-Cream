using Ice_Cream.Data;
using Ice_Cream.DTOs.GustRecipeDTO;
using Ice_Cream.Models;
using Microsoft.EntityFrameworkCore;

namespace Ice_Cream.Services
{
    public class GuestService : IGuestService
    {
        private readonly IceCreamDbContext _context;

        public GuestService(IceCreamDbContext context)
        {
            _context = context;
        }

        private static GuestRecipeDTO MapToDTO(Recipe recipe)
        {
            return new GuestRecipeDTO
            {
                Id = recipe.Id,
                RecipeName = recipe.RecipeName,
                RecipeDate = recipe.RecipeDate,
                RecipeDescription = recipe.RecipeDescription,
                RecipeThumbnail = recipe.RecipeThumbnail,
                RecipeImage = recipe.RecipeImage,
                RecipeRequireSubscription = recipe.RecipeRequireSubscription,
                AverageRating = recipe.Rating?.Value ?? 0,
                CommentsCount = recipe.Comment != null ? 1 : 0 // This should be updated based on your actual comment counting logic
            };
        }

        public async Task<IEnumerable<GuestRecipeDTO>> GetAllRecipesWithGuestAsync()
        {
            var recipes = await _context.Recipes
                .Include(r => r.Rating)
                .Include(r => r.Comment)
                .Include(r => r.FAQs)
                .ToListAsync();

            return recipes.Select(MapToDTO);
        }

        public async Task<GuestRecipeDTO> GetRecipeByIdWithGuestAsync(int id)
        {
            var recipe = await _context.Recipes
                .Include(r => r.Rating)
                .Include(r => r.Comment)
                .Include(r => r.FAQs)
                .FirstOrDefaultAsync(r => r.Id == id);

            return recipe == null ? null : MapToDTO(recipe);
        }
    }
}
