using Ice_Cream.DTO;
using Ice_Cream.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ice_Cream.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private readonly IRecipeService _recipeService;
        private readonly IFileService _fileService;
        private readonly ILogger<RecipeController> _logger;

        public RecipeController(IRecipeService recipeService, IFileService fileService, ILogger<RecipeController> logger)
        {
            _recipeService = recipeService;
            _fileService = fileService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipeDTO>>> GetRecipes()
        {
            var recipes = await _recipeService.GetAllRecipesAsync();
            return Ok(recipes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RecipeDTO>> GetRecipe(int id)
        {
            var recipe = await _recipeService.GetRecipeByIdAsync(id);
            if (recipe == null)
                return NotFound();
            return Ok(recipe);
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<RecipeDTO>> CreateRecipe([FromForm] CreateRecipeFormDTO createRecipeFormDto)
        {
            try
            {
                // Handle thumbnail
                string? thumbnailPath = null;
                if (createRecipeFormDto.RecipeThumbnail != null)
                {
                    thumbnailPath = await _fileService.SaveImageAsync(createRecipeFormDto.RecipeThumbnail);
                }

                // Handle multiple images
                List<string>? imagePaths = null;
                if (createRecipeFormDto.RecipeImage != null && createRecipeFormDto.RecipeImage.Any())
                {
                    imagePaths = await _fileService.SaveImagesAsync(createRecipeFormDto.RecipeImage);
                }

                var createRecipeDTO = new CreateRecipeDTO
                {
                    RecipeName = createRecipeFormDto.RecipeName,
                    RecipeDescription = createRecipeFormDto.RecipeDescription,
                    RecipeSteps = createRecipeFormDto.RecipeSteps,
                    RecipeIngredient = createRecipeFormDto.RecipeIngredient,
                    RecipeProcedures = createRecipeFormDto.RecipeProcedures,
                    RecipeRequireSubscription = createRecipeFormDto.RecipeRequireSubscription,
                    RecipeThumbnail = thumbnailPath,
                    RecipeImage = imagePaths != null ? string.Join(",", imagePaths) : null
                };

                var recipe = await _recipeService.CreateRecipeAsync(createRecipeDTO);
                return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, recipe);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult> UpdateRecipe(int id, [FromForm] UpdateRecipeFormDTO updateRecipeFormDto)
        {
            if (id != updateRecipeFormDto.Id)
                return BadRequest();

            try
            {
                var existingRecipe = await _recipeService.GetRecipeByIdAsync(id);
                if (existingRecipe == null)
                    return NotFound();

                // Handle thumbnail
                string? thumbnailPath = existingRecipe.RecipeThumbnail;
                if (updateRecipeFormDto.RecipeThumbnail != null)
                {
                    // Delete old thumbnail
                    if (!string.IsNullOrEmpty(existingRecipe.RecipeThumbnail))
                    {
                        _fileService.DeleteImage(existingRecipe.RecipeThumbnail);
                    }
                    thumbnailPath = await _fileService.SaveImageAsync(updateRecipeFormDto.RecipeThumbnail);
                }

                // Handle multiple images
                string? imagePaths = existingRecipe.RecipeImage;
                if (updateRecipeFormDto.RecipeImage != null && updateRecipeFormDto.RecipeImage.Any())
                {
                    // Delete old images
                    if (!string.IsNullOrEmpty(existingRecipe.RecipeImage))
                    {
                        foreach (var oldPath in existingRecipe.RecipeImage.Split(','))
                        {
                            _fileService.DeleteImage(oldPath);
                        }
                    }
                    var newPaths = await _fileService.SaveImagesAsync(updateRecipeFormDto.RecipeImage);
                    imagePaths = string.Join(",", newPaths);
                }

                var updateRecipeDTO = new UpdateRecipeDTO
                {
                    Id = id,
                    RecipeName = updateRecipeFormDto.RecipeName,
                    RecipeDescription = updateRecipeFormDto.RecipeDescription,
                    RecipeSteps = updateRecipeFormDto.RecipeSteps,
                    RecipeIngredient = updateRecipeFormDto.RecipeIngredient,
                    RecipeProcedures = updateRecipeFormDto.RecipeProcedures,
                    RecipeRequireSubscription = updateRecipeFormDto.RecipeRequireSubscription,
                    RecipeThumbnail = thumbnailPath,
                    RecipeImage = imagePaths
                };

                var success = await _recipeService.UpdateRecipeAsync(updateRecipeDTO);
                if (!success)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRecipe(int id)
        {
            var success = await _recipeService.DeleteRecipeAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
