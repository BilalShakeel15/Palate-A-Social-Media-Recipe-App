using System.ComponentModel.DataAnnotations;

namespace Palete.models
{
    public class PostWithMediaDTO
    {
        public string? Caption { get; set; }
        public string Type { get; set; }
        public int UserId { get; set; }
        public List<IFormFile>? MediaFiles { get; set; }
    }
}
