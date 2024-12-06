namespace Palete.models
{
    public class StoryWithUserDto
    {
        public int StoryId { get; set; }
        public string MediaUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Username { get; set; }
        public string Bio { get; set; }
        public string ProfilePictureUrl { get; set; }  // Assuming Profile Picture URL is available in Register table
    }
}
