using Microsoft.AspNetCore.Mvc;
using Palete.models;
using Microsoft.EntityFrameworkCore;

namespace Palete.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly PaleteDBContext _context;
        public LoginController(PaleteDBContext context)
        {
            _context=context;
        }

        [HttpPost]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users
                                      .Where(u => u.Username == request.Username && u.Password == request.Password)
                                      .FirstOrDefaultAsync();

            if (user == null)
            {
                return Unauthorized(false);
            }

            return Ok(user);
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
