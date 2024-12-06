using System.ComponentModel.DataAnnotations;

namespace Palete.models
{
    public class UpdateUsernameDto
    {
        [Required(ErrorMessage = "Username is required.")]

        [StringLength(20, MinimumLength = 8, ErrorMessage = "Username contains 8 to 20 characters.")]
        public string Username
        {
            get; set;
        }
    }
}
