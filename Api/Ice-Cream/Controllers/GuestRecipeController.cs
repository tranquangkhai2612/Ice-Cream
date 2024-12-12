using Ice_Cream.Models;
using Ice_Cream.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ice_Cream.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuestRecipeController : ControllerBase
    {
        private readonly IGuestService _recipeService;
        private readonly ILogger<GuestRecipeController> _logger;

        public GuestRecipeController(IGuestService recipeService, ILogger<GuestRecipeController> logger)
        {
            _recipeService = recipeService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes()
        {
            try
            {
                var recipes = await _recipeService.GetAllRecipesWithGuestAsync();
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recipes");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Recipe>> GetRecipe(int id)
        {
            try
            {
                var recipe = await _recipeService.GetRecipeByIdWithGuestAsync(id);

                if (recipe == null)
                    return NotFound($"Recipe with ID {id} not found");

                return Ok(recipe);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recipe with id {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
