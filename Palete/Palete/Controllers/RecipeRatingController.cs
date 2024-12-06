using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Palete.models;

namespace Palete.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeRatingsController : ControllerBase
    {
        private readonly PaleteDBContext _context;

        public RecipeRatingsController(PaleteDBContext context)
        {
            _context = context;
        }

        [HttpGet("recipe/{recipeId}")]
        public async Task<ActionResult> GetRatingsForRecipe(int recipeId)
        {
            var ratings = await _context.RecipeRating
                .Where(r => r.RecipeId == recipeId)
                .Select(r => new { r.UserId, r.Rating })
                .ToListAsync();

            return Ok(ratings);
        }

        [HttpGet("userRating/{recipeId}/{userId}")]
        public async Task<ActionResult> GetRatingsForRecipe(int recipeId,int userId)
        {
            var ratings = await _context.RecipeRating
                .Where(r => (r.RecipeId == recipeId && r.UserId==userId))
                .Select(r =>  r.Rating )
                .ToListAsync();

            return Ok(ratings);
        }

        [HttpPost]
        public async Task<ActionResult<RecipeRating>> PostRating( RRDto rating)
        {
            // Check if the recipe exists in the Recipes table
            var recipeExists = await _context.Recipes
    .FirstOrDefaultAsync(r => r.RecipeId == rating.RecipeId);

            if (recipeExists==null)
            {
                return BadRequest("The specified recipe does not exist.");
            }

            // Check if the user exists in the Users table (if applicable)
            var userExists = await _context.Users
                .AnyAsync(u => u.Id == rating.UserId);

            if (!userExists)
            {
                return BadRequest("The specified user does not exist.");
            }

            // Check if the user has already rated this recipe
            var existingRating = await _context.RecipeRating
                .FirstOrDefaultAsync(r => r.RecipeId == rating.RecipeId && r.UserId == rating.UserId);

            if (existingRating != null)
            {
                // If the user has already rated the recipe, update the rating
                existingRating.Rating = rating.Rating;
                _context.RecipeRating.Update(existingRating);
            }
            else
            {
                var newrating = new RecipeRating
                {
                    RecipeId = rating.RecipeId,
                    UserId = rating.UserId,
                    Rating = rating.Rating,
                };
                // If not, add the new rating
                _context.RecipeRating.Add(newrating);
            }

            // Save changes to the database
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteRating(int recipeId, int userId)
        {
            // Check if the rating exists for the given RecipeId and UserId
            var existingRating = await _context.RecipeRating
                .FirstOrDefaultAsync(r => r.RecipeId == recipeId && r.UserId == userId);

            if (existingRating == null)
            {
                return NotFound("Rating not found for the specified recipe and user.");
            }

            // If the rating exists, delete it
            _context.RecipeRating.Remove(existingRating);

            // Save the changes to the database
            await _context.SaveChangesAsync();

            return Ok("Rating deleted successfully.");
        }

        [HttpGet("GetAverageRating/{recipeId}")]
        public async Task<IActionResult> GetAverageRating(int recipeId)
        {
            var ratings = await _context.RecipeRating
                .Where(r => r.RecipeId == recipeId)
                .ToListAsync();

            if (ratings == null || ratings.Count == 0)
                return NotFound("No ratings available for this recipe.");

            var averageRating = ratings.Average(r => r.Rating);

            return Ok( averageRating
            );
        }



    }
}
