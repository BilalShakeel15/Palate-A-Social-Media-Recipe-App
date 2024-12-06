import React, { useEffect, useState } from 'react';
import CreateStory from './create_story.js'; // Create Story Component
import StoryView from './story_view.js'; // Story Viewer Component
import FeedPost from './feed_post.js';
import '../../styles/feed.css';
import profilePic from '../../images/feed_pfp.png';
import profileIcon from '../../images/profile_icon.png';
import Navbar from '../navbar.js';
import PlusIcon from '../../images/plus_icon.png';
import { createAPIEndpoint, ENDPOINTS } from '../../api/api.js';
import defaultdp from '../../images/default_dp.jpg';

const Feed = () => {
    const [isCreatingStory, setIsCreatingStory] = useState(false);
    const [stories, setStories] = useState([]);
    const [isViewingStory, setIsViewingStory] = useState(false);
    const [currentStory, setCurrentStory] = useState([]);
    const [posts, setPosts] = useState([]);
    const [userStory,setUserStory]=useState([]);
    const [otherStories,setotherStories]=useState([]);
    const [isVideo,setisVideo]=useState(false);
    var biodata=JSON.parse(localStorage.getItem('bioData'));
    const BASE_URL='https://localhost:7101';
    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.postfeed)
            .fetchById(localStorage.getItem("userid"))
            .then((response) => {
                if (response.data && response.data.Posts) {
                    setPosts(response.data.Posts); // Extract and set Posts
                }
            })
            .catch((error) => console.error("Error fetching posts:", error));
        createAPIEndpoint(ENDPOINTS.userStory)
        .fetchById(localStorage.getItem("userid"))
        .then((response)=>setUserStory(response.data))
        .catch((err)=>console.log(err)
        )
        createAPIEndpoint(ENDPOINTS.otherStory)
        .fetchById(localStorage.getItem("userid"))
        .then((response)=>setotherStories(response.data))
        .catch((err)=>console.log(err)
        )
    }, []); // Empty dependency array to ensure this runs only once

    const otherUsersStories = Array.from({ length: 24 }).map((_, index) => ({
        username: `User ${index + 1}`,
        imageSrc: profilePic,
        content: [
            { src: profilePic, type: 'image' },
            { src: profilePic, type: 'image' },
        ],
    }));
    const handleAddStory = (newStories) => {
        const newStoryData = newStories.map((file) => ({
            src: URL.createObjectURL(file),
            type: file.type.startsWith('video') ? 'video' : 'image',
        }));
        setStories([...stories, ...newStoryData]);
    };

    const handleStoryClick = (story) => {
        setCurrentStory(story);
        setIsViewingStory(true);
        // console.log(otherStories);
        
    };
    const showuserStory=()=>{
        if(userStory){
        setCurrentStory(userStory);
        setIsViewingStory(true)
        }
    }

    return (
        <>
            <Navbar />
            <div className="stories-wrapper">
                <div className="stories">
                    {/* User's story creation */}
                    <div className="story" >
                        <img src={biodata?.dp?`${BASE_URL}${biodata.dp}`:defaultdp} alt="User Story" className="profile-icon" onClick={showuserStory}/>
                        <div className="plus-icon" onClick={() => setIsCreatingStory(true)}>
                            <img src={PlusIcon} alt="Plus Icon" />
                        </div>
                    </div>
                    {/* Other users' stories */}
                    {otherStories.map((story, index) => (
                        <div
                            className="story"
                            key={index}
                            onClick={() => handleStoryClick(story)}
                        >
                            
                            <img src={story?.ProfilePictureUrl?`${BASE_URL}${story.ProfilePictureUrl}`:defaultdp} alt={`Story of ${story.username}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Story Modal */}
            {isCreatingStory && (
                <CreateStory
                    onClose={() => setIsCreatingStory(false)}
                    addStory={handleAddStory}
                />
            )}

            {/* Story Viewer */}
            {isViewingStory && currentStory && (
                <StoryView
                    stori={currentStory}
                    onClose={() => setIsViewingStory(false)}
                />
            )}

            {/* Feed Posts */}
            <div className="feed-container" onClick={()=>{console.log(userStory);
            }}>
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <FeedPost
                            key={index}
                            id={post.postId}
                            username={post.Username} // Placeholder username, replace if available
                            dp={post.UserDp}
                            time={new Date(post.CreatedAt).toLocaleString()} // Format created time
                            
                            caption={post.Caption} // Display post caption
                            media={post.MediaPaths} // Pass media array
                            likes={post.LikeCount} // Placeholder for likes
                            comments={0} // Placeholder for comments
                        />
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
            </div>
        </>
    );
};

export default Feed;
