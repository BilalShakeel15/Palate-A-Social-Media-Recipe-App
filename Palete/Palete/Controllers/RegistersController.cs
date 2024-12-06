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
    public class RegistersController : ControllerBase
    {
        private readonly PaleteDBContext _context;
        private readonly string _connectionString;

        public RegistersController(PaleteDBContext context,IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("PaleteConnection");
        }

        [HttpGet("user-stats/{userId}")]
        public async Task<IActionResult> GetUserStats(int userId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                var postCount = await connection.ExecuteScalarAsync<int>(
                    "SELECT COUNT(*) FROM Posts WHERE UserId = @UserId", new { UserId = userId });

                var recipeCount = await connection.ExecuteScalarAsync<int>(
                    "SELECT COUNT(*) FROM Recipes WHERE UserId = @UserId", new { UserId = userId });

                var followerCount = await connection.ExecuteScalarAsync<int>(
                    "SELECT COUNT(*) FROM Follows WHERE FollowedId = @UserId", new { UserId = userId });

                var followingCount = await connection.ExecuteScalarAsync<int>(
                    "SELECT COUNT(*) FROM Follows WHERE FollowerId = @UserId", new { UserId = userId });

                var totalLikes = await connection.ExecuteScalarAsync<int>(
                    @"SELECT COUNT(*) FROM Likes 
                      WHERE PostId IN (SELECT Id FROM Posts WHERE UserId = @UserId) AND IsLiked = 1",
                      new { UserId = userId });

                return Ok(new
                {
                    PostCount = postCount,
                    RecipeCount = recipeCount,
                    FollowerCount = followerCount,
                    FollowingCount = followingCount,
                    TotalLikes = totalLikes
                });
            }
        }

        // GET: api/Registers All users
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            try
            {
                var query = @"
            SELECT 
                Users.Id, 
                Users.Username, 
                Bio.dp
            FROM Users
            LEFT JOIN Bio ON Users.Id = Bio.UserId";

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    var usersWithBio = await connection.QueryAsync<dynamic>(query);

                    var result = usersWithBio.Select(user => new
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Bio = user.dp != null ? new { dp = user.dp } : null
                    });

                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }



        // GET: api/Registers/Details/5
        // GET: api/Registers/{id}
        // User with bio
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserWithBio(int id)
        {
            try
            {
                var query = @"
            SELECT 
                Users.Id AS UserId,
                Users.Username,
                Users.Password,
                Users.Answer1,
                Users.Answer2,
                Bio.Id AS BioId,
                Bio.Name AS BioName,
                Bio.Description AS BioDescription,
                Bio.Link AS BioLink,
                Bio.dp AS BioDp,
                Bio.CreatedAt AS BioCreatedAt
            FROM Users
            INNER JOIN Bio ON Users.Id = Bio.UserId
            WHERE Users.Id = @UserId";

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    var userWithBio = await connection.QueryFirstOrDefaultAsync<dynamic>(query, new { UserId = id });

                    if (userWithBio == null)
                    {
                        return NotFound();
                    }

                    var result = new
                    {
                        UserId = userWithBio.UserId,
                        Username = userWithBio.Username,
                        Password = userWithBio.Password,
                        Answer1 = userWithBio.Answer1,
                        Answer2 = userWithBio.Answer2,
                        BioId = userWithBio.BioId,
                        BioName = userWithBio.BioName,
                        BioDescription = userWithBio.BioDescription,
                        BioLink = userWithBio.BioLink,
                        BioDp = userWithBio.BioDp,
                        BioCreatedAt = userWithBio.BioCreatedAt
                    };

                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }





        // POST: api/Registers/Create
        [HttpPost]
        public async Task<IActionResult> Create(RegisterDto registertemp)
        {
            try
            {
                // Construct the SQL query for insertion
                var query = @"
            INSERT INTO Users (Username, Password, Answer1, Answer2)
            VALUES (@Username, @Password, @Answer1, @Answer2)";

                // Map the incoming data to parameters
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    var parameters = new
                    {
                        Username = registertemp.Username,
                        Password = registertemp.Password,
                        Answer1 = registertemp.Answer1,
                        Answer2 = registertemp.Answer2
                    };

                    // Execute the query
                    await connection.ExecuteAsync(query, parameters);

                    return Ok("Your Account has been created successfully!");
                }
            }
            catch (Exception ex)
            {
                // Return an error response in case of an exception
                return StatusCode(500, new { message = ex.Message });
            }
        }



        [HttpPut("UpdateUsername/{userId}")]
        public async Task<IActionResult> UpdateUsername(int userId, UpdateUsernameDto request)
        {
            // Validate the request
            if (string.IsNullOrEmpty(request.Username))
            {
                return BadRequest("Username cannot be empty.");
            }

            // Find the user by ID
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Check if the new username is already taken (optional, but recommended)
            var usernameExists = await _context.Users.AnyAsync(u => u.Username == request.Username);
            if (usernameExists)
            {
                return BadRequest("Username is already taken.");
            }

            // Update the username
            user.Username = request.Username;

            // Save the changes to the database
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // Return a success response
            return Ok(new { message = "Username updated successfully." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    // Start a SQL transaction
                    using (var transaction = connection.BeginTransaction())
                    {
                        try
                        {
                            // SQL commands within the transaction
                            string deleteFollowsQuery = @"
                        DELETE FROM Follows
                        WHERE FollowerId = @UserId OR FollowedId = @UserId";

                            string deleteUserQuery = @"
                        DELETE FROM Users
                        WHERE Id = @UserId";

                            // Execute queries within the transaction
                            await connection.ExecuteAsync(deleteFollowsQuery, new { UserId = id }, transaction);
                            var rowsAffected = await connection.ExecuteAsync(deleteUserQuery, new { UserId = id }, transaction);

                            // Check if the user existed
                            if (rowsAffected == 0)
                            {
                                transaction.Rollback(); // Rollback if user not found
                                return NotFound("User not found.");
                            }

                            // Commit the transaction
                            transaction.Commit();
                            return Ok("User deleted successfully.");
                        }
                        catch (Exception ex)
                        {
                            // Rollback the transaction on error
                            transaction.Rollback();
                            return StatusCode(500, new { message = ex.Message });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


    }
}