namespace Palete.models
{
    public class CommentDto
    {
        public int PostId { get; set; }  // Foreign key for the post
        public string Username { get; set; }
        public string Text { get; set; }
    }
}
