using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Palete.models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly PaleteDBContext _context;

    public CommentsController(PaleteDBContext context)
    {
        _context = context;
    }

    // GET: api/Comments/{postId}
    [HttpGet("{postId}")]
    public async Task<ActionResult<IEnumerable<Comments>>> GetComments(int postId)
    {
        var comments = await _context.Comments
                                     .Where(c => c.PostId == postId)
                                     .OrderByDescending(c => c.CreatedAt)
                                     .ToListAsync();
        return Ok(comments);
    }

    // POST: api/Comments
    [HttpPost]
    public async Task<ActionResult<Comments>> PostComment( CommentDto comment)
    {
        var newcomment = new Comments
        {
            PostId = comment.PostId,
            Text = comment.Text,
            Username = comment.Username
        };
        _context.Comments.Add(newcomment);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetComments), new { postId = comment.PostId }, comment);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> SoftDeletePost(int id)
    {
        var comment = await _context.Comments.FirstOrDefaultAsync(p => p.CommentId == id);

        if (comment == null)
        {
            return NotFound();
        }

        
        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();

        return Ok();
    }



}
