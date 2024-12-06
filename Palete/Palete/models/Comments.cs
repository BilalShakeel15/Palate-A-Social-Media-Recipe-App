using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Palete.models
{
    public class Comments
    {
        [Key]
        public int CommentId { get; set; }

        [ForeignKey("Posts")]
        public int PostId { get; set; }  // Foreign key for the post
        public string Username { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public virtual Posts Post { get; set; }  // Navigation property for the related post
    }

}
