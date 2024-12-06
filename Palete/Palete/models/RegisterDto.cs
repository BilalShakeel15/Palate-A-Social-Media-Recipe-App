using System.ComponentModel.DataAnnotations.Schema;

namespace Palete.models
{
    public class RegisterDto
    {
        [Column(TypeName = "nvarchar(250)")]
        public string Username { get; set; }

        [Column(TypeName = "nvarchar(250)")]
        public string Password { get; set; }

        [Column(TypeName = "nvarchar(250)")]
        public string Answer1 { get; set; }

        [Column(TypeName = "nvarchar(250)")]
        public string Answer2 { get; set; }
    }
}
