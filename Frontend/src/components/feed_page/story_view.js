import React, { useState, useEffect } from "react";
import "../../styles/story_view.css";
import Close from "../../images/close.png";
import MoreOptions from "../../images/more.png";
import Mute from "../../images/mute.png";
import Unmute from "../../images/unmute.png";
import Pause from "../../images/pause.png";
import Play from "../../images/play.png";
import Like from "../../images/heart.png";
import demoImage from "../../images/RecipeDetailPic.png"; // Ensure demo image import is correct
import Send from "../../images/send.png";

const StoryView = ({ stori, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const BASE_URL='https://localhost:7101';
  // Extract story data
  const { Username, ProfilePictureUrl, MediaUrl } = stori || {};
  

  useEffect(() => {
    setLoading(true);
    const loadingTimeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(loadingTimeout);
  }, [stori]);

  useEffect(() => {
    let timerInterval;

    if (!paused) {
      timerInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timerInterval);
            onClose(); // Automatically close when progress reaches 100%
            return prev;
          }
          return prev + 1;
        });
      }, 100); // Progress updates every 100ms
    }

    return () => clearInterval(timerInterval);
  }, [paused, onClose]);

  const toggleMute = () => setMuted(!muted);
  const togglePause = () => setPaused(!paused);

  if (!stori) {
    return <div>No story available.</div>;
  }

  return (
    <div className="story-view-container">
      <div className="story-view">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Header */}
        <div className="story-header">
          <div className="header-left">
            <img
              src={ProfilePictureUrl? `${BASE_URL}${ProfilePictureUrl}`:demoImage} // Fallback to demo image for profile
              alt="Profile"
              className="profile-icon"
            />
            <div className="user-details">
              <span className="username">{Username || "Unknown User"}</span>
              {/* {bio && <p className="user-bio">{bio}</p>} */}
            </div>
          </div>
          <div className="header-right">
            <img
              src={paused ? Play : Pause}
              alt={paused ? "Play" : "Pause"}
              className="header-icon"
              onClick={togglePause}
            />
            <img
              src={muted ? Unmute : Mute}
              alt={muted ? "Unmute" : "Mute"}
              className="header-icon"
              onClick={toggleMute}
            />
            <img src={Close} alt="Close" className="header-icon" onClick={onClose} />
            <img src={MoreOptions} alt="More Options" className="header-icon" />
          </div>
        </div>

        {/* Story Content */}
        <div className="story-content">
          {loading ? (
            <div className="loading-container">
              <div className="circle"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <>
      {stori.MediaUrl?.endsWith(".mp4") || stori.MediaUrl?.endsWith(".webm") ? (
        <video
          className="story-video"
          src={`${BASE_URL}${stori.MediaUrl}`}
          controls={!muted} // Enable controls if unmuted
          muted={muted}
          autoPlay
          loop
        ></video>
      ) : (
        <img
          className="story-image"
          src={`${BASE_URL}${stori.MediaUrl}` || demoImage} // Fallback to demo image for content
          alt="Story Media"
        />
      )}
    </>
          )}
        </div>

        {/* Footer */}
        <div className="story-footer">
          <input
            type="text"
            className="reply-input"
            placeholder="Reply to this story..."
          />
          <img src={Send} alt="Send" className="send-icon" />
          <img src={Like} alt="Like" className="story-like-icon" />
        </div>
      </div>
    </div>
  );
};

export default StoryView;
