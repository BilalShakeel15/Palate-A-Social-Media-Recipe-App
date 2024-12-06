namespace Palete.models
{
    public class UserPostsDTO
    {
        public int UserId { get; set; }

        public string Username { get; set; }

        public string UserDp { get; set; }

        public int postId { get; set; }

        public int LikeCount { get; set; }
        public string? Caption { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string>? MediaPaths { get; set; }
    }

    public class UserPostsResponseDTO
    {
        public int TotalPosts { get; set; }
        public List<UserPostsDTO>? Posts { get; set; }
    }
}
