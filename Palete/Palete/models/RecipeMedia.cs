using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Palete.models
{
    public class RecipeMedia
    {
        [Key]
        public int MediaId { get; set; }

        [Required]
        public int RecipeId { get; set; } // Foreign Key linking to Recipe table

        [Required]
        public string MediaType { get; set; } // E.g., "Image" or "Video"

        [Required]
        public string MediaUrl { get; set; } // URL or file path for the media

        // Navigation property
        [ForeignKey("RecipeId")]
        public Recipes Recipe { get; set; }
    }
}
