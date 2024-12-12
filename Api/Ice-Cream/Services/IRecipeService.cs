using Ice_Cream.DTOs.AdminRecipeDTO;

namespace Ice_Cream.Services
{
    public interface IRecipeService
    {
        Task<IEnumerable<RecipeResponseDTO>> GetAllRecipesAsync();
        Task<RecipeResponseDTO?> GetRecipeByIdAsync(int id);
        Task<RecipeResponseDTO> CreateRecipeAsync(CreateRecipeDTO recipe);
        Task<RecipeResponseDTO> UpdateRecipeAsync(int id, UpdateRecipeDTO recipe);
        Task<bool> DeleteRecipeAsync(int id);
        Task<IEnumerable<RecipeResponseDTO>> SearchRecipesAsync(string searchTerm);
    }
}
