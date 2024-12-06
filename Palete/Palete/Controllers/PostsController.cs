using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Palete.models;

namespace Palete.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly PaleteDBContext _context;

        public PostsController(PaleteDBContext context)
        {
            _context = context;
        }

        // GET: api/Posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Posts>>> GetPosts()
        {
            return await _context.Posts.ToListAsync();
        }

        // GET: api/Posts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Posts>> GetPosts(int id)
        {
            var posts = await _context.Posts.FindAsync(id);

            if (posts == null)
            {
                return NotFound();
            }

            return posts;
        }

        // PUT: api/Posts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPosts(int id, Posts posts)
        {
            if (id != posts.Id)
            {
                return BadRequest();
            }

            _context.Entry(posts).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Posts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Posts>> PostPosts([FromForm] PostWithMediaDTO postsDto)
        {
            // Create the Posts object
            var post = new Posts
            {
                Caption = postsDto.Caption,
                Type = postsDto.Type,
                CreatedAt = DateTime.Now,
                UserId = postsDto.UserId
            };

            // Add the post to the database
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            // Check if any files were uploaded
            if (postsDto.MediaFiles != null && postsDto.MediaFiles.Count > 0)
            {
                // Folder where media will be stored
                var mediaFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "postmedia");
                if (!Directory.Exists(mediaFolderPath))
                {
                    Directory.CreateDirectory(mediaFolderPath);
                }

                // Loop through each media file and save it
                foreach (var mediaFile in postsDto.MediaFiles)
                {
                    if (mediaFile.Length > 0)
                    {
                        // Create a unique file name for the media file
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(mediaFile.FileName);
                        var filePath = Path.Combine(mediaFolderPath, fileName);

                        // Save the media file to the specified folder
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await mediaFile.CopyToAsync(stream);
                        }

                        // Save the media info in PostMedia table
                        var postMedia = new PostMedia
                        {
                            Path = "/postmedia/" + fileName, // Store the relative path to access from client
                            PostId = post.Id
                        };

                        _context.PostMedia.Add(postMedia);
                    }
                }

                // Save changes for PostMedia entries
                await _context.SaveChangesAsync();
            }

            // Return the created post with media info
            return Ok("Created Successfully");
        }


        // DELETE: api/Posts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePosts(int id)
        {
            // Find the post by ID
            var posts = await _context.Posts.Include(p => p.PostMedia).FirstOrDefaultAsync(p => p.Id == id);

            if (posts == null)
            {
                return NotFound();
            }

            // Loop through the associated media and delete the files from the directory
            foreach (var media in posts.PostMedia)
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), media.Path.TrimStart('/'));

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath); // Delete the file from the folder
                }
            }

            // Remove the post from the database (along with associated media records)
            _context.Posts.Remove(posts);
            await _context.SaveChangesAsync();

            return Ok("Deleted Successfully");
        }


        private bool PostsExists(int id)
        {
            return _context.Posts.Any(e => e.Id == id);
        }

        [HttpGet("user/{userId}/posts")]
        public async Task<IActionResult> GetPostsByUser(int userId)
        {
            // Fetch all posts by the specified user, including their associated media
            var posts = await _context.Posts
                .Where(p => p.UserId == userId)
                .Include(p => p.PostMedia) // Include associated media
                .ToListAsync();

            // If no posts are found for the user, return NotFound
            if (posts == null || posts.Count == 0)
            {
                return NotFound("No posts found for this user.");
            }

            // Map the posts to the DTO
            var response = new UserPostsResponseDTO
            {
                TotalPosts = posts.Count,
                Posts = posts.Select(p => new UserPostsDTO
                {
                    Caption = p.Caption,
                    CreatedAt = p.CreatedAt,
                    MediaPaths = p.PostMedia.Select(m => m.Path).ToList() // Ensure this is just a list of strings
                }).ToList()
            };

            // Return the structured response directly
            return Ok(response);
        }


        [HttpGet("feed/{userId}")]
        public async Task<IActionResult> GetPostsFromFollowedUsers(int userId)
        {
            // Get the list of users that the current user follows
            var followedUserIds = await _context.Follows
                .Where(f => f.FollowerId == userId)
                .Select(f => f.FollowedId)
                .ToListAsync();

            if (followedUserIds.Count == 0)
            {
                return NotFound("This user is not following anyone.");
            }

            // Fetch posts from the followed users, including media and likes count
            var postsWithLikes = await _context.Posts
                .Where(p => followedUserIds.Contains(p.UserId))
                .Include(p => p.PostMedia) // Include associated media
                .Include(p => p.User) // Include user data
                .ThenInclude(u => u.Bio) // Include user bio for UserDp
                .Select(p => new
                {
                    Post = p,
                    LikeCount = p.Likes.Count() // Count the number of likes for each post
                })
                .OrderByDescending(p => p.Post.CreatedAt) // Order posts by creation date
                .ToListAsync();

            if (postsWithLikes == null || postsWithLikes.Count == 0)
            {
                return NotFound("No posts found from followed users.");
            }

            // Map to DTO
            var postsDTO = postsWithLikes.Select(p => new UserPostsDTO
            {
                postId = p.Post.Id,
                UserId = p.Post.UserId,
                Username = p.Post.User.Username, // Use preloaded data
                UserDp = p.Post.User.Bio?.dp, // Use preloaded bio data
                Caption = p.Post.Caption,
                CreatedAt = p.Post.CreatedAt,
                MediaPaths = p.Post.PostMedia.Select(m => m.Path).ToList(),
                LikeCount = p.LikeCount // Include the like count
            }).ToList();

            var response = new UserPostsResponseDTO
            {
                TotalPosts = postsWithLikes.Count,
                Posts = postsDTO
            };

            return Ok(response);
        }




    }
}