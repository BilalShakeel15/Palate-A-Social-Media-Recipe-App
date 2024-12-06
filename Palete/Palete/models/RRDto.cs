using System.ComponentModel.DataAnnotations.Schema;

namespace Palete.models
{
    public class RRDto
    {
        public int RecipeId { get; set; } 

       
        public int UserId { get; set; } 

        public int Rating { get; set; } 
    }
}
