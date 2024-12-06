using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Dapper;
using System.Data.SqlClient;
using Palete.models;


namespace Palete.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BiosController : ControllerBase
    {
        private readonly string _connectionString;

        public BiosController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("PaleteConnection");
        }

        // GET: All Bios
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var bios = await connection.QueryAsync("SELECT * FROM Bio");
                return Ok(bios);
            }
        }

        // GET: Bios/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> Details(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var bio = await connection.QueryFirstOrDefaultAsync("SELECT * FROM Bio WHERE UserId = @Id", new { Id = id });
                if (bio == null)
                {
                    return NotFound("Bio not found.");
                }

                return Ok(bio);
            }
        }

        // POST: Bios
        [HttpPost]
        public async Task<IActionResult> CreateBio([FromForm] Bio bio)
        {
            // Validate the input (if needed)
            if (bio == null || bio.UserId == 0)
            {
                return BadRequest("Invalid bio data.");
            }

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        // Check if the user exists
                        var user = await connection.QueryFirstOrDefaultAsync("SELECT * FROM Users WHERE Id = @UserId", new { UserId = bio.UserId }, transaction);
                        if (user == null)
                        {
                            // Rollback the transaction if user is not found
                            transaction.Rollback();
                            return NotFound("User not found.");
                        }

                        // Check if the bio for this user already exists
                        var existingBio = await connection.QueryFirstOrDefaultAsync("SELECT * FROM Bio WHERE UserId = @UserId", new { UserId = bio.UserId }, transaction);

                        if (existingBio != null)
                        {
                            // Update existing bio
                            var updateQuery = @"
                        UPDATE Bio
                        SET Name = @Name, Description = @Description, Link = @Link
                        WHERE UserId = @UserId";
                            await connection.ExecuteAsync(updateQuery, new { bio.Name, bio.Description, bio.Link, bio.UserId }, transaction);
                        }
                        else
                        {
                            // Insert new bio with default values for Name, Description, Link
                            var insertQuery = @"
                        INSERT INTO Bio (UserId, Name, Description, Link)
                        VALUES (@UserId, @Name, @Description, @Link)";
                            await connection.ExecuteAsync(insertQuery, new { bio.UserId, bio.Name, bio.Description, bio.Link }, transaction);
                        }

                        // Commit transaction after the changes are successful
                        transaction.Commit();
                        return Ok("Bio created or updated successfully.");
                    }
                    catch (Exception ex)
                    {
                        // Rollback in case of an exception and log it
                        transaction.Rollback();
                        // You can log the exception here (e.g. _logger.LogError(ex, "Error updating bio"))
                        return StatusCode(500, $"Error updating bio: {ex.Message}");
                    }
                }
            }
        }


        // PUT: Bios/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> EditBio(int id, Bio bio)
        {
            if (id != bio.Id)
            {
                return BadRequest("Bio ID mismatch.");
            }

            using (var connection = new SqlConnection(_connectionString))
            {
                var updateQuery = @"
                    UPDATE Bio
                    SET Name = @Name, Description = @Description, Link = @Link
                    WHERE Id = @Id";

                var rowsAffected = await connection.ExecuteAsync(updateQuery, bio);
                if (rowsAffected == 0)
                {
                    return NotFound("Bio not found.");
                }

                return Ok("Bio updated successfully.");
            }
        }

        // DELETE: Bios/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBio(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        var deleteQuery = "DELETE FROM Bio WHERE Id = @Id";
                        var rowsAffected = await connection.ExecuteAsync(deleteQuery, new { Id = id }, transaction);

                        if (rowsAffected == 0)
                        {
                            transaction.Rollback();
                            return NotFound("Bio not found.");
                        }

                        transaction.Commit();
                        return Ok("Bio deleted successfully.");
                    }
                    catch (Exception)
                    {
                        transaction.Rollback();
                        return StatusCode(500, "Error deleting bio.");
                    }
                }
            }
        }

        // POST: Upload Profile Picture
        [HttpPost("UploadProfile/{userId}")]
        public async Task<IActionResult> UploadProfile([FromForm] ProfileUpload profileUpload)
        {
            var userId = profileUpload.UserId;
            var file = profileUpload.File;

            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var profileFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "profile");
            if (!Directory.Exists(profileFolderPath))
            {
                Directory.CreateDirectory(profileFolderPath);
            }

            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(profileFolderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        var bio = await connection.QueryFirstOrDefaultAsync(
                            "SELECT * FROM Bio WHERE UserId = @UserId", new { UserId = userId }, transaction);

                        if (bio == null)
                        {
                            var dp = $"/profile/{fileName}";
                            var CreatedAt = DateTime.Now; // Declare the CreatedAt variable
                            var insertQuery = @"
INSERT INTO Bio (UserId, Name, Description, Link, CreatedAt, dp)
VALUES (@UserId, NULL, NULL, NULL, @CreatedAt, @Dp)";
                            await connection.ExecuteAsync(insertQuery, new
                            {
                                UserId = userId,
                                CreatedAt = CreatedAt,
                                Dp = $"/profile/{fileName}" // Profile picture path
                            }, transaction);
                        }
                        else
                        {
                            var updateQuery = "UPDATE Bio SET dp = @Dp WHERE UserId = @UserId";
                            await connection.ExecuteAsync(updateQuery, new { UserId = userId, Dp = $"/profile/{fileName}" }, transaction);
                        }

                        transaction.Commit();
                        return Ok(new { message = "Profile picture uploaded successfully.", filePath = $"/profile/{fileName}" });
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return StatusCode(500, $"Error uploading profile picture: {ex.Message}");
                    }
                }
            }
        }

    }
}
