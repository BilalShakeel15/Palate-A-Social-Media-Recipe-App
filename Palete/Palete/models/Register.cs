using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Palete.models
{
    public class Register
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(250)")]
        public string Username { get; set; }

        [Column(TypeName = "nvarchar(250)")]
        public string Password { get; set; }

        [Column(TypeName = "nvarchar(250)")]
        public string Answer1 { get; set; }

        [Column(TypeName = "nvarchar(250)")]
        public string Answer2 { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public virtual Bio? Bio {  get; set; }

        public virtual ICollection<Posts> Posts { get; set; } = new List<Posts>();

        public virtual ICollection<Recipes> Recipes { get; set; } =new List<Recipes>();

        public virtual ICollection<Likes>? Likes { get; set; }

        public virtual ICollection<RecipeRating> RecipeRatings { get; set; }

    }
}
