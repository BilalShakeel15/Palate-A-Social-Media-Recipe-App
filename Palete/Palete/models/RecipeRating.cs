using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Palete.models
{
    public class RecipeRating
    {
        [Key]
        public int Id { get; set; } // Primary key

        [ForeignKey("Recipe")]
        public int RecipeId { get; set; } // Foreign key for Recipe

        [ForeignKey("User")]
        public int UserId { get; set; } // Foreign key for User

        public int Rating { get; set; } // Rating value

        // Navigation properties
        public virtual Recipes Recipe { get; set; }
        public virtual Register User { get; set; }
    }
}
