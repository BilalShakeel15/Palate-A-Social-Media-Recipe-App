using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Palete.models;

namespace Palete.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        // GET: NotificationController
        private readonly PaleteDBContext _context;

        public NotificationController(PaleteDBContext context)
        {
            _context = context;
        }

        [HttpGet("getnotifications/{userId}")]
        public async Task<IActionResult> GetUserNotifications(int userId)
        {
            // Get all notifications for the given user, ordering unread notifications on top
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderBy(n => n.IsRead) // Unread notifications first
                .ThenByDescending(n => n.DateCreated) // Latest first
                .ToListAsync();

            // Map notifications with optional follower information, including follower dp
            var followRequests = notifications.Select(n => new
            {
                n.NotificationId,
                n.IsRead,
                n.Message,
                n.DateCreated,
                FollowerId = n.FollowerId,
                Follower = n.FollowerId.HasValue
                    ? _context.Users
                        .Where(u => u.Id == n.FollowerId.Value)
                        .Select(u => new
                        {
                            u.Id,
                            u.Username, // Or any other relevant fields from the Users table
                            DisplayPicture = _context.Bio
                                .Where(b => b.UserId == u.Id)
                                .Select(b => b.dp) // Assuming 'Dp' is the field for the display picture in Bio
                                .FirstOrDefault()
                        })
                        .FirstOrDefault()
                    : null // Return null if FollowerId is null
            }).ToList();

            return Ok(followRequests);
        }

        [HttpDelete("/{noti_id}")]

        public async Task<IActionResult> DeleteNoti(int noti_id)
        {
            var noti = await _context.Notifications.FindAsync(noti_id);
            if (noti == null)
            {
                return NotFound("Notification not found.");
            }

            // Remove the bio
            _context.Notifications.Remove(noti);
            await _context.SaveChangesAsync();

            return Ok("Notification deleted successfully.");
        }

        [HttpPost("markAsRead")]
        public async Task<IActionResult> MarkNotificationsAsRead([FromBody] List<int> notificationIds)
        {
            // Fetch notifications that need to be marked as read
            Console.WriteLine(notificationIds.Count);
            var notifications = await _context.Notifications
                .Where(n => notificationIds.Contains(n.NotificationId))
                .ToListAsync();

            if (notifications == null || notifications.Count == 0)
            {
                return NotFound("No notifications found to update.");
            }

            // Update the IsRead field for all the notifications
            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            // Save the changes
            await _context.SaveChangesAsync();

            return Ok("Notifications marked as read successfully.");
        }



    }
}
