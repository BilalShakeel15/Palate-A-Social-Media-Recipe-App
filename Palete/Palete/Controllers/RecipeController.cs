using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Palete.models;
using Palete.models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Palete.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private readonly PaleteDBContext _context;

        public RecipeController(PaleteDBContext context)
        {
            _context = context;
        }

        // POST: api/Recipe
        [HttpPost]
        public async Task<IActionResult> AddRecipe([FromForm] RecipeDto recipeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Begin a database transaction
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Step 1: Store recipe details in the Recipe table
                var recipe = new Recipes
                {
                    Title = recipeDto.Title,
                    Description = recipeDto.Description,
                    Instructions = recipeDto.Instructions,
                    Ingredients = recipeDto.Ingredients,
                    Notes = recipeDto.Notes,
                    TimeInMinutes = recipeDto.TimeInMinutes,
                    Difficulty = recipeDto.Difficulty,
                    Serves = recipeDto.Serves,
                    category=recipeDto.category,
                    UserId=recipeDto.UserId
                };

                _context.Recipes.Add(recipe);
                await _context.SaveChangesAsync();

                // Step 2: Store media files (if provided)
                var mediaList = new List<RecipeMedia>();
                var mediaFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/recipeMedia");

                if (!Directory.Exists(mediaFolder))
                {
                    Directory.CreateDirectory(mediaFolder);
                }

                foreach (var file in recipeDto.MediaFiles)
                {
                    // Generate a unique file name
                    var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                    var filePath = Path.Combine(mediaFolder, uniqueFileName);

                    // Save file to the folder
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    // Add media record
                    mediaList.Add(new RecipeMedia
                    {
                        RecipeId = recipe.RecipeId,
                        MediaType = Path.GetExtension(file.FileName).ToLower() == ".mp4" ? "Video" : "Image",
                        MediaUrl = $"/recipeMedia/{uniqueFileName}"
                    });
                }

                if (mediaList.Any())
                {
                    _context.RecipeMedia.AddRange(mediaList);
                    await _context.SaveChangesAsync();
                }

                // Commit transaction if everything succeeds
                await transaction.CommitAsync();

                return Ok(new { message = "Recipe added successfully", recipeId = recipe.RecipeId });
            }
            catch (Exception ex)
            {
                // Rollback transaction in case of any error
                await transaction.RollbackAsync();

                // Return error message
                return StatusCode(500, new { message = "An error occurred while adding the recipe", error = ex.Message });
            }
        }

        // DELETE: api/Recipe/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            // Start a transaction to ensure atomicity
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Find the recipe along with its associated media
                var recipe = await _context.Recipes
                    .Include(r => r.Media)
                    .FirstOrDefaultAsync(r => r.RecipeId == id);

                if (recipe == null)
                {
                    return NotFound(new { message = "Recipe not found." });
                }

                // Step 1: Delete media files from the server
                foreach (var media in recipe.Media)
                {
                    var mediaFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", media.MediaUrl.TrimStart('/'));

                    if (System.IO.File.Exists(mediaFilePath))
                    {
                        System.IO.File.Delete(mediaFilePath); // Delete the media file from the server
                    }
                }

                // Step 2: Delete media records from the database
                _context.RecipeMedia.RemoveRange(recipe.Media);

                // Step 3: Delete the recipe record from the database
                _context.Recipes.Remove(recipe);

                // Save changes to the database
                await _context.SaveChangesAsync();

                // Commit transaction
                await transaction.CommitAsync();

                return Ok(new { message = "Recipe and associated media deleted successfully." });
            }
            catch (Exception ex)
            {
                // Rollback transaction in case of any error
                await transaction.RollbackAsync();

                return StatusCode(500, new { message = "An error occurred while deleting the recipe", error = ex.Message });
            }
        }


        // GET: api/Recipe/User/{userId}
        [HttpGet("User/{userId}")]
        public async Task<IActionResult> GetRecipesByUser(int userId)
        {
            try
            {
                // Fetch recipes by the provided UserId along with associated media
                var recipes = await _context.Recipes
                    .Include(r => r.Media) // Include media related to the recipes
                    .Where(r => r.UserId == userId) // Filter by UserId
                    .ToListAsync();

                if (!recipes.Any())
                {
                    return NotFound(new { message = "No recipes found for the given user." });
                }

                // Transform data into a user-friendly structure
                var recipeList = recipes.Select(r => new
                {
                    RecipeId = r.RecipeId,
                    Title = r.Title,
                    Description = r.Description,
                    Instructions = r.Instructions,
                    Ingredients = r.Ingredients,
                    Notes = r.Notes,
                    TimeInMinutes = r.TimeInMinutes,
                    Difficulty = r.Difficulty,
                    Serves = r.Serves,
                    Media = r.Media.Select(m => new
                    {
                        MediaId = m.MediaId,
                        MediaType = m.MediaType,
                        MediaUrl = m.MediaUrl
                    }).ToList()
                });

                return Ok(recipeList);
            }
            catch (Exception ex)
            {
                // Return an error message in case of an exception
                return StatusCode(500, new { message = "An error occurred while fetching the recipes", error = ex.Message });
            }
        }

        [HttpGet("Recipefeed/{currentUserId}")]
        public async Task<List<Recipes>> GetFollowedUserRecipesAsync(int currentUserId)
        {
            
                // Get all followed users by the current user
                var followedUsers = await _context.Follows
                    .Where(f => f.FollowerId == currentUserId && f.IsAccepted)
                    .Select(f => f.FollowedId)  // Get the list of followed users
                    .ToListAsync();

                // Fetch recipes of the followed users
                var followedRecipes = await _context.Recipes
                    .Where(r => followedUsers.Contains(r.UserId))  // Get recipes of followed users
                    .ToListAsync();

                return followedRecipes;
            
        }

        [HttpGet("RecipeMedia/{recipeId}")]
        public async Task<IActionResult> GetRecipeMedia(int recipeId)
        {
            try
            {
                // Fetch the recipe's media by the provided recipeId
                var recipeMedia = await _context.RecipeMedia
                    .Where(m => m.RecipeId == recipeId) // Assuming Media is related to Recipe via RecipeId
                    .ToListAsync();

                // Check if there are no media for the given recipe
                if (recipeMedia == null || !recipeMedia.Any())
                {
                    return NotFound(new { message = "No media found for the given recipe." });
                }

                // Return the media data, customize as necessary
                var mediaList = recipeMedia.Select(m => new
                {
                    MediaId = m.MediaId,
                    MediaType = m.MediaType,
                    MediaUrl = m.MediaUrl
                }).ToList();

                return Ok(mediaList);
            }
            catch (Exception ex)
            {
                // Handle error and return a message
                return StatusCode(500, new { message = "An error occurred while fetching media", error = ex.Message });
            }
        }


    }
}
