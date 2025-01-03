using Ice_Cream.DTO;

namespace Ice_Cream.Services
{
    public interface IRecipeService
    {
        Task<IEnumerable<RecipeDTO>> GetAllRecipesAsync();
        Task<RecipeDTO?> GetRecipeByIdAsync(int id);
        Task<RecipeDTO> CreateRecipeAsync(CreateRecipeDTO createRecipeDTO);
        Task<bool> UpdateRecipeAsync(UpdateRecipeDTO updateRecipeDTO);
        Task<bool> DeleteRecipeAsync(int id);
    }
}
