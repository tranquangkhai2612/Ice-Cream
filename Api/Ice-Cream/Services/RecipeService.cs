using AutoMapper;
using Ice_Cream.DB;
using Ice_Cream.DTO;
using Ice_Cream.Models;
using Microsoft.EntityFrameworkCore;

namespace Ice_Cream.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public RecipeService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<RecipeDTO>> GetAllRecipesAsync()
        {
            var recipes = await _context.Recipes
                .OrderByDescending(r => r.RecipeDate)
                .ToListAsync();
            return _mapper.Map<IEnumerable<RecipeDTO>>(recipes);
        }

        public async Task<RecipeDTO?> GetRecipeByIdAsync(int id)
        {
            var recipe = await _context.Recipes.FindAsync(id);
            return recipe != null ? _mapper.Map<RecipeDTO>(recipe) : null;
        }

        public async Task<RecipeDTO> CreateRecipeAsync(CreateRecipeDTO createRecipeDTO)
        {
            var recipe = _mapper.Map<Recipe>(createRecipeDTO);
            recipe.RecipeDate = DateTime.UtcNow;

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();
            return _mapper.Map<RecipeDTO>(recipe);
        }

        public async Task<bool> UpdateRecipeAsync(UpdateRecipeDTO updateRecipeDTO)
        {
            var recipe = await _context.Recipes.FindAsync(updateRecipeDTO.Id);
            if (recipe == null)
                return false;

            _mapper.Map(updateRecipeDTO, recipe);
            await _context.SaveChangesAsync();
            return true;
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
    }
}
