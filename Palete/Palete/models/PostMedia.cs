using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Palete.models
{
    public class PostMedia
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Path { get; set; }

        // Foreign key to the Register table
        [ForeignKey("Posts")]
        public int PostId { get; set; }

        // Navigation property to Register (User)
        public virtual Posts? Post { get; set; }
    }
}
