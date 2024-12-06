namespace Palete.models
{
    public class Follow
    {
        public int FollowId { get; set; }  // Primary Key
        public int FollowerId { get; set; }  // User who is following
        public int FollowedId { get; set; }  // User who is being followed
        public bool IsAccepted { get; set; }  // Whether the follow request is accepted or not
        public DateTime DateFollowed { get; set; }

        public Register Follower { get; set; }  // The user who follows
        public Register Followed { get; set; }  // The user being followed
    }

}
