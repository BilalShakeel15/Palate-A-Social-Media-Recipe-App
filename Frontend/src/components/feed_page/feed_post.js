import React, { useEffect, useState } from "react";
import "../../styles/feed_post.css";
import profilePic from "../../images/feed_pfp.png";
import LikeIcon from "../../images/heart.png"; // Heart outline icon
import LikedIcon from "../../images/notifications.png"; // Heart filled icon
import Comment from "../../images/comment.png";
import Share from "../../images/share.png";
import { createAPIEndpoint, ENDPOINTS } from "../../api/api.js";

function timeAgo(createdAt) {
  const now = new Date();
  const postDate = new Date(createdAt);
  const diffMs = now - postDate; // Difference in milliseconds

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return days === 1 ? `${days} day ago` : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
  } else {
    return seconds === 1 ? `${seconds} second ago` : `${seconds} seconds ago`;
  }
}

const FeedPost = ({ id, username, dp, time, caption, media, likes, comments }) => {
  const BASE_URL = "https://localhost:7101";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(false); // Track like state
  const [likeCount, setLikeCount] = useState(likes || 0); // Track like count
  const [postComments, setPostComments] = useState(comments || []);
  const [newComment, setNewComment] = useState(""); // For the input field
  const [showComments, setShowComments] = useState(false); // Toggle comment section

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < (media?.length || 1) - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    fetch(`https://localhost:7101/api/Like/check-like/${localStorage.getItem("userid")}/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data === true) {
          setLiked(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching like status:", error);
      });

    // Fetch comments for the post
    createAPIEndpoint(ENDPOINTS.addcomments)
      .fetchById(id)
      .then((res) => setPostComments(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1); // Decrease like count
    } else {
      setLikeCount(likeCount + 1); // Increase like count
    }

    const userId = localStorage.getItem("userid");
    const postId = id; // Assuming id is passed as an argument to this function
    const url = `${ENDPOINTS.updatelike}/${userId}/${postId}`;

    if (userId && postId) {
      createAPIEndpoint(url)
        .post()
        .then((response) => {
          console.log(response.data); // Handle success response
        })
        .catch((err) => {
          console.log(err); // Handle error
        });
    } else {
      console.log("User ID or Post ID is missing");
    }
    setLiked(!liked); // Toggle like state
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return; // Prevent empty comments

    const username = localStorage.getItem("username");
    const newCommentData = {
      postId: id,
      Username: username,
      Text: newComment,
    };

    createAPIEndpoint(ENDPOINTS.addcomments)
      .post(newCommentData)
      .then((response) => {
        // Update the comments in the UI
        setPostComments((prevComments) => [...prevComments, response.data]);
        setNewComment(""); // Clear the input field
      })
      .catch((err) => {
        console.error("Error adding comment:", err);
      });
  };

  return (
    <div className="post">
      {/* Post Header */}
      <div className="post-header">
        <img src={`${BASE_URL}${dp}`} alt="Profile" className="profile-pic" />
        <div className="post-info">
          <h4>{username || "Anonymous User"}</h4>
          <p>{time ? timeAgo(time) : "Just now"}</p>
        </div>
      </div>

      {/* Caption */}
      <p className="post-caption">{caption || "No caption provided"}</p>

      {/* Media Section */}
      <div className="carousel-container">
        <div className="carousel-inner post-media">
          {media?.map((item, index) => (
            <div
              key={index}
              className={`carousel-item ${index === currentIndex ? "active" : "inactive"}`}
            >
              {item.endsWith(".mp4") ? (
                <video controls className="d-block w-100 post-media-item">
                  <source src={`${BASE_URL}${item}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={`${BASE_URL}${item}`}
                  alt={`Media ${index}`}
                  className="d-block w-100 post-media-item"
                />
              )}
            </div>
          ))}
        </div>
        {media?.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              &lt;
            </button>
            <button
              className="carousel-control-next"
              onClick={handleNext}
              disabled={currentIndex === media.length - 1}
            >
              &gt;
            </button>
          </>
        )}
      </div>

      {/* Actions Section */}
      <div className="post-actions">
        <span className="like-count" onClick={handleLike}>
          <img
            src={liked ? LikedIcon : LikeIcon}
            alt="Like Icon"
            className={`like-icon ${liked ? "liked" : ""}`}
          />
          {likeCount}
        </span>
        <span className="comment-action" onClick={() => setShowComments(!showComments)}>
          <img src={Comment} alt="Comment Icon" />
          {postComments.length || "Comment"}
        </span>
        <span className="share-action">
          <img src={Share} alt="Share Icon" />
        </span>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          {postComments.map((comment, index) => (
            <div key={index} className="comment">
              <strong className="comment-username">{comment.Username}</strong>
              <span className="comment-text">{comment.Text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment */}
      <div className="add-comment">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Post</button>
      </div>
    </div>
  );
};

export default FeedPost;
