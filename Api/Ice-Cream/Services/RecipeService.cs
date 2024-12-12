using Ice_Cream.Data;
using Ice_Cream.DTOs.AdminRecipeDTO;
using Ice_Cream.Models;
using Microsoft.EntityFrameworkCore;

namespace Ice_Cream.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly IceCreamDbContext _context;

        public RecipeService(IceCreamDbContext context)
        {
            _context = context;
        }

        private static RecipeResponseDTO MapToDTO(Recipe recipe)
        {
            return new RecipeResponseDTO
            {
                Id = recipe.Id,
                RecipeName = recipe.RecipeName,
                RecipeDate = recipe.RecipeDate,
                RecipeDescription = recipe.RecipeDescription,
                RecipeSteps = recipe.RecipeSteps,
                RecipeIngredient = recipe.RecipeIngredient,
                RecipeProcedures = recipe.RecipeProcedures,
                RecipeThumbnail = recipe.RecipeThumbnail,
                RecipeImage = recipe.RecipeImage,
                RecipeRequireSubscription = recipe.RecipeRequireSubscription,
                AverageRating = recipe.Rating?.Value ?? 0,
                CommentsCount = recipe.Comment != null ? 1 : 0 // This should be updated based on your actual comment counting logic
            };
        }

        public async Task<IEnumerable<RecipeResponseDTO>> GetAllRecipesAsync()
        {
            var recipes = await _context.Recipes
                .Include(r => r.Rating)
                .Include(r => r.Comment)
                .Include(r => r.FAQs)
                .ToListAsync();

            return recipes.Select(MapToDTO);
        }

        public async Task<RecipeResponseDTO> GetRecipeByIdAsync(int id)
        {
            var recipe = await _context.Recipes
                .Include(r => r.Rating)
                .Include(r => r.Comment)
                .Include(r => r.FAQs)
                .FirstOrDefaultAsync(r => r.Id == id);

            return recipe == null ? null : MapToDTO(recipe);
        }

        public async Task<RecipeResponseDTO> CreateRecipeAsync(CreateRecipeDTO createRecipeDto)
        {
            var recipe = new Recipe
            {
                RecipeName = createRecipeDto.RecipeName,
                RecipeDescription = createRecipeDto.RecipeDescription,
                RecipeSteps = createRecipeDto.RecipeSteps,
                RecipeIngredient = createRecipeDto.RecipeIngredient,
                RecipeProcedures = createRecipeDto.RecipeProcedures,
                RecipeThumbnail = createRecipeDto.RecipeThumbnail,
                RecipeImage = createRecipeDto.RecipeImage,
                RecipeRequireSubscription = createRecipeDto.RecipeRequireSubscription,
                RecipeDate = DateTime.UtcNow
            };

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            return await GetRecipeByIdAsync(recipe.Id);
        }

        public async Task<RecipeResponseDTO> UpdateRecipeAsync(int id, UpdateRecipeDTO updateRecipeDto)
        {
            var existingRecipe = await _context.Recipes.FindAsync(id);

            if (existingRecipe == null)
                return null;

            existingRecipe.RecipeName = updateRecipeDto.RecipeName;
            existingRecipe.RecipeDescription = updateRecipeDto.RecipeDescription;
            existingRecipe.RecipeSteps = updateRecipeDto.RecipeSteps;
            existingRecipe.RecipeIngredient = updateRecipeDto.RecipeIngredient;
            existingRecipe.RecipeProcedures = updateRecipeDto.RecipeProcedures;
            existingRecipe.RecipeThumbnail = updateRecipeDto.RecipeThumbnail;
            existingRecipe.RecipeImage = updateRecipeDto.RecipeImage;
            existingRecipe.RecipeRequireSubscription = updateRecipeDto.RecipeRequireSubscription;

            await _context.SaveChangesAsync();
            return await GetRecipeByIdAsync(id);
        }

        public async Task<bool> DeleteRecipeAsync(int id)
        {
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null)
                return false;

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<RecipeResponseDTO>> SearchRecipesAsync(string searchTerm)
        {
            var recipes = await _context.Recipes
                .Where(r => r.RecipeName.Contains(searchTerm) ||
                           r.RecipeDescription.Contains(searchTerm) ||
                           r.RecipeIngredient.Contains(searchTerm))
                .Include(r => r.Rating)
                .Include(r => r.Comment)
                .ToListAsync();

            return recipes.Select(MapToDTO);
        }
    }
}

