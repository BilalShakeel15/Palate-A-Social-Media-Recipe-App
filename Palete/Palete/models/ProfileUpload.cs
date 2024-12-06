namespace Palete.models
{
    public class ProfileUpload
    {
        public int UserId { get; set; }
        public IFormFile File { get; set; }
    }
}
