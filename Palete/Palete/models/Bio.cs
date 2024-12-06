using System.ComponentModel.DataAnnotations;

namespace Palete.models
{
    public class Bio
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        public string? Name { get; set; }
        public string? Description { get; set; }

        public string? Link { get; set; }

        public string? dp { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;



        public virtual Register? User { get; set; }
    } 
}
