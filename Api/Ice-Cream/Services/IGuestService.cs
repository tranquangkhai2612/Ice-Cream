using Ice_Cream.DTOs.GustRecipeDTO;

namespace Ice_Cream.Services
{
    public interface IGuestService
    {
        Task<IEnumerable<GuestRecipeDTO>> GetAllRecipesWithGuestAsync();
        Task<GuestRecipeDTO> GetRecipeByIdWithGuestAsync(int id);
    }
}
