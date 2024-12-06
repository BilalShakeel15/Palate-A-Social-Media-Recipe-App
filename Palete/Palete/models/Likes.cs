using System.ComponentModel.DataAnnotations.Schema;

namespace Palete.models
{
    public class Likes
    {
        public int Id { get; set; }

        [ForeignKey("Register")]
        public int UserId { get; set; }

        [ForeignKey("Posts")]
        public int PostId { get; set; }
        public bool IsLiked { get; set; } // true for like, false for unlike

        // Navigation Properties
        public virtual Register User { get; set; }
        public virtual Posts Post { get; set; }
    }

}
