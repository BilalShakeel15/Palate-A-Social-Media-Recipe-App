using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Palete.models
{
    public class Posts
    {
        [Key]
        public int Id { get; set; }

        public string? Caption { get; set; }

        public string Type { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Foreign key to the Register table
        [ForeignKey("Register")]
        public int UserId { get; set; }

        // Navigation property to Register (User)
        public virtual Register? User { get; set; }

        public virtual ICollection<PostMedia> PostMedia { get; set; }=new List<PostMedia>();

        public virtual ICollection<Likes> Likes { get; set; }

        public virtual ICollection<Comments> Comments { get; set; }
    }
}
