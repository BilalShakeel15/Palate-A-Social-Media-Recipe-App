using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Palete.models;

namespace Palete.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikeController : ControllerBase
    {
        private readonly PaleteDBContext _context;
        public LikeController(PaleteDBContext context)
        {
            _context = context;
        }


        [HttpPost("like/{userId}/{postId}")]
        public async Task<IActionResult> LikePost(int userId, int postId)
        {
            // Check if the user has already liked this post
            var existingLike = await _context.Likes
                .FirstOrDefaultAsync(l => l.UserId == userId && l.PostId == postId);

            if (existingLike != null)
            {
                // If the post is already liked, toggle the like (unlike it)
                existingLike.IsLiked = !existingLike.IsLiked;
                _context.Likes.Update(existingLike);
            }
            else
            {
                // If the post hasn't been liked, add a new like entry
                var newLike = new Likes
                {
                    UserId = userId,
                    PostId = postId,
                    IsLiked = true
                };
                await _context.Likes.AddAsync(newLike);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("check-like/{userId}/{postId}")]
        public async Task<IActionResult> CheckIfUserLikedPost(int userId, int postId)
        {
            var like = await _context.Likes
                .FirstOrDefaultAsync(l => l.UserId == userId && l.PostId == postId && l.IsLiked);

            if (like != null)
            {
                return Ok(true); // User has liked the post
            }
            else
            {
                return Ok(false); // User has not liked the post
            }
        }

    }
}
