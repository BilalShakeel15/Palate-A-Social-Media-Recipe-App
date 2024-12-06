using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Palete.models;

namespace Palete.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class FollowController : ControllerBase
    {
        private readonly PaleteDBContext _context;

        public FollowController(PaleteDBContext context)
        {
            _context = context;
        }

        [HttpPost("follow/{followedUserId}/{followerUserId}")]
        public async Task<IActionResult> FollowUser(int followedUserId, int followerUserId)
        {
            // Check if the follower is already following the followed user
            var existingFollow = await _context.Follows
                .FirstOrDefaultAsync(f => f.FollowerId == followerUserId && f.FollowedId == followedUserId);

            if (existingFollow != null)
            {
                return BadRequest("You are already following this user.");
            }

            // Add new follow record
            var follow = new Follow
            {
                FollowerId = followerUserId,
                FollowedId = followedUserId,
                IsAccepted = false,  // Initial state is pending approval
                DateFollowed = DateTime.UtcNow
            };

            _context.Follows.Add(follow);

            // Create a notification for the followed user
            var notification = new Notification
            {
                UserId = followedUserId,
                Message = $"{followerUserId} has followed you. Please accept or reject the follow request.",
                IsRead = false,
                FollowerId=followerUserId,
                DateCreated = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);

            // Save changes
            await _context.SaveChangesAsync();

            return Ok(new { message = "Follow request sent.", followId = follow.FollowId });
        }

        [HttpPost("acceptFollow/{followerId}/{followedId}/{notificationId}")]
        public async Task<IActionResult> AcceptFollowRequest(int followerId, int followedId, int notificationId)
        {
            // Find the follow request
            var follow = await _context.Follows
                .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowedId == followedId);

            if (follow == null)
            {
                return NotFound("Follow request not found.");
            }

            // Accept the follow request
            follow.IsAccepted = true;

            // Save changes to the follow request
            await _context.SaveChangesAsync();

            // Create or update the notification
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.NotificationId == notificationId);

            
                // Update the notification message if it exists
                notification.Message = "Follow request Accepted.";
                notification.IsRead = true;
                notification.DateCreated = DateTime.UtcNow;
            
                // Create a new notification if it doesn't exist
                notification = new Notification
                {
                    UserId = follow.FollowerId,
                    Message = "Your follow request has been accepted.",
                    IsRead = false,
                    FollowerId = followedId,
                    DateCreated = DateTime.UtcNow
                };

                _context.Notifications.Add(notification);
            

            // Save changes to the notification
            await _context.SaveChangesAsync();

            return Ok(true);
        }


        [HttpPost("rejectFollow/{followerId}/{followedId}/{notificationId}")]
        public async Task<IActionResult> RejectFollowRequest(int followerId, int followedId, int notificationId)
        {
            // Find the follow request based on followerId and followedId
            var follow = await _context.Follows
                .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowedId == followedId);

            if (follow == null)
            {
                return NotFound("Follow request not found.");
            }

            // Remove the follow record from the Follows table
            _context.Follows.Remove(follow);

            // Find and remove the notification based on notificationId
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.NotificationId == notificationId);

            if (notification != null)
            {
                _context.Notifications.Remove(notification);
            }

            // Create a new notification for the follower indicating rejection
            var newNotification = new Notification
            {
                UserId = follow.FollowerId, // Send to the follower
                Message = "Your follow request has been rejected.",
                IsRead = false,
                FollowerId = followedId,
                DateCreated = DateTime.UtcNow
            };

            // Add the new notification to the database
            _context.Notifications.Add(newNotification);

            // Save changes to the database
            await _context.SaveChangesAsync();

            return Ok(new { message = "Follow request rejected and notification sent." });
        }


        [HttpGet("isFollower/{followerUserId}/{followedUserId}")]
        public async Task<IActionResult> IsFollower(int followerUserId, int followedUserId)
        {
            var follow = await _context.Follows
                .FirstOrDefaultAsync(f => f.FollowerId == followerUserId && f.FollowedId == followedUserId);

            if (follow != null)
            {
                return Ok(new
                {
                    isFollower = follow.IsAccepted,  // True if the follow is accepted
                    isRequested = !follow.IsAccepted // True if the follow request is pending
                });
            }

            // No relationship exists
            return Ok(new
            {
                isFollower = false,
                isRequested = false
            });
        }


        [HttpDelete("unfollow/{followedUserId}/{followerUserId}")]
        public async Task<IActionResult> UnfollowUser(int followedUserId, int followerUserId)
        {
            // Find the follow relationship between the follower and followed user
            var follow = await _context.Follows
                .FirstOrDefaultAsync(f => f.FollowerId == followerUserId && f.FollowedId == followedUserId);

            if (follow == null)
            {
                return NotFound("You are not following this user.");
            }

            // Remove the follow relationship
            _context.Follows.Remove(follow);

            // Optionally, create a notification for the unfollowed user
            var notification = new Notification
            {
                UserId = followedUserId,
                Message = $"{followerUserId} has unfollowed you.",
                IsRead = false,
                DateCreated = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);

            // Save changes
            await _context.SaveChangesAsync();

            return Ok(new { message = "Successfully unfollowed the user." });
        }




    }
}
