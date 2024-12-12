using Ice_Cream.DTOs.AdminRecipeDTO;
using Ice_Cream.Models;
using Ice_Cream.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IceCreamParlourAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminRecipeController : ControllerBase
    {
        private readonly IRecipeService _recipeService;
        private readonly ILogger<AdminRecipeController> _logger;

        public AdminRecipeController(IRecipeService recipeService, ILogger<AdminRecipeController> logger)
        {
            _recipeService = recipeService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes()
        {
            try
            {
                var recipes = await _recipeService.GetAllRecipesAsync();
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
                var recipe = await _recipeService.GetRecipeByIdAsync(id);

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

        [HttpPost]
        public async Task<ActionResult<Recipe>> CreateRecipe([FromBody] CreateRecipeDTO recipe)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var createdRecipe = await _recipeService.CreateRecipeAsync(recipe);
                return CreatedAtAction(nameof(GetRecipe), new { id = createdRecipe.Id }, createdRecipe);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating recipe");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<RecipeResponseDTO>> UpdateRecipe(int id, [FromBody] UpdateRecipeDTO recipe)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updatedRecipe = await _recipeService.UpdateRecipeAsync(id, recipe);

                if (updatedRecipe == null)
                    return NotFound($"Recipe with ID {id} not found");

                return Ok(updatedRecipe);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating recipe with id {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRecipe(int id)
        {
            try
            {
                var result = await _recipeService.DeleteRecipeAsync(id);

                if (!result)
                    return NotFound($"Recipe with ID {id} not found");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting recipe with id {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Recipe>>> SearchRecipes([FromQuery] string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                    return BadRequest("Search term cannot be empty");

                var recipes = await _recipeService.SearchRecipesAsync(searchTerm);
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching recipes with term {SearchTerm}", searchTerm);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
