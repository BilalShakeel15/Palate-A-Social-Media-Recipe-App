using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Palete.models;

namespace Palete.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoryController : ControllerBase
    {
        private readonly PaleteDBContext _context;

        public StoryController(PaleteDBContext context)
        {
            _context = context;
        }

        [HttpGet("userStory/{userId}")]
        public async Task<IActionResult> Get(int userId)
        {
            if (userId == 0)
            {
                return BadRequest("Invalid user ID.");
            }

            // Query to fetch the story along with the user details
            var userStory = await _context.Story
                .Where(s => s.UserId == userId)
                .Select(s => new
                {
                    s.Id,
                    s.UserId,
                    s.MediaUrl,
                    s.UploadDate,
                    s.ExpiryDate,
                    Username = _context.Users.Where(u => u.Id == s.UserId).Select(u => u.Username).FirstOrDefault(),
                    ProfilePictureUrl = _context.Users
    .Where(u => u.Id == s.UserId)
    .Select(u => u.Bio.dp) // Assuming `dp` is the column storing the profile picture URL
    .FirstOrDefault()
        })
                .FirstOrDefaultAsync();

            if (userStory == null)
            {
                return Ok(null);
            }

            return Ok(userStory);
        }


        [HttpPost("upload")]
        public async Task<IActionResult> UploadStory([FromForm] int userId,[FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Define the folder where media will be stored
            string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "StoryMedia");

            // Create the folder if it doesn't exist
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            // Create a unique filename to avoid overwriting files
            string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

            // Define the full path for the file
            string filePath = Path.Combine(folderPath, uniqueFileName);

            // Save the file to the folder
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Construct the URL to access the file
            string fileUrl = $"/StoryMedia/{uniqueFileName}";

            // Store the file URL in the database (if needed)
            var newStory = new Story
            {
                UserId = userId, // Assume the user is authenticated
                MediaUrl = fileUrl,
                UploadDate = DateTime.UtcNow
            };

            _context.Story.Add(newStory);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Story uploaded successfully.", FileUrl = fileUrl });
        }
        [HttpDelete("deleteStory/{storyId}")]
        public async Task<IActionResult> DeleteStory(int storyId)
        {
            // Check if the storyId is valid
            if (storyId <= 0)
            {
                return BadRequest("Invalid story ID.");
            }

            // Find the story in the database
            var story = await _context.Story.FindAsync(storyId);

            // Check if the story exists
            if (story == null)
            {
                return NotFound("Story not found.");
            }

            // Remove the story from the database
            _context.Story.Remove(story);

            // Save changes to the database
            await _context.SaveChangesAsync();

            return Ok("Story deleted successfully.");
        }

        [HttpGet("user-stories/{userId}")]
        public async Task<IActionResult> GetUserStories(int userId)
        {
            // Step 1: Get the list of users the user is following
            var followedUserIds = await _context.Follows
                .Where(f => f.FollowerId == userId && f.IsAccepted)
                .Select(f => f.FollowedId)
                .ToListAsync();

            // Step 2: Fetch the stories of the followed users along with the user's details
            var stories = await _context.Story
                .Where(s => followedUserIds.Contains(s.UserId)) // Filter stories by followed users
                .OrderByDescending(s => s.UploadDate)  // Optionally order by creation date
                .Join(_context.Users, s => s.UserId, u => u.Id, (s, u) => new { s, u })
                .Join(_context.Bio, su => su.u.Id, b => b.UserId, (su, b) => new StoryWithUserDto
                {
                    StoryId = su.s.Id,
                    MediaUrl = su.s.MediaUrl,
                    CreatedAt = su.s.UploadDate,
                    Username = su.u.Username,
                    ProfilePictureUrl = b.dp // Profile picture from Bio table
                })
                .ToListAsync();

            // Step 3: Return the stories
            if (stories == null || !stories.Any())
            {
                return NotFound("No stories found for followed users.");
            }

            return Ok(stories);
        }


    }

    

}
