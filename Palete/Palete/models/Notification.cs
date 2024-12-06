namespace Palete.models
{
    public class Notification
    {
        public int NotificationId { get; set; }
        public int UserId { get; set; }  // The user receiving the notification
        public string Message { get; set; }
        public bool IsRead { get; set; }
        public DateTime DateCreated { get; set; }

        public DateTime DateUpdated { get; set; }
        public int? FollowerId { get; set; }

        public Register User { get; set; }  // The user receiving the notification
    }

}
