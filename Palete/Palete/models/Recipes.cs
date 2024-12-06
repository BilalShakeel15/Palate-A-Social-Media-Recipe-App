using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Palete.models
{
    public class Recipes
    {
        [Key]
        public int RecipeId { get; set; }

        

        [Required]
        [MaxLength(100)] // Limit title length
        public string Title { get; set; }

        public string? Description { get; set; }

        public string? Instructions { get; set; }

        public string? Ingredients { get; set; }

        public string? Notes { get; set; }

        public int TimeInMinutes { get; set; } // Time it takes to prepare the recipe

        [MaxLength(50)] // Difficulty level (e.g., Easy, Medium, Hard)
        public string Difficulty { get; set; }

        public int Serves { get; set; } // Number of people it serves

        public string category { get; set; }

        [ForeignKey("Register")]
        public int UserId { get; set; }

        public virtual Register? User { get; set; }

        // Navigation property for multimedia (images/videos)
        public ICollection<RecipeMedia> Media { get; set; } = new List<RecipeMedia>();

        public virtual ICollection<RecipeRating> RecipeRatings { get; set; }
    }
}
