import React, { useEffect, useState } from 'react';
import recipeIcon from '../../images/recipe_icon.png';
import addPost from '../../images/add_post.png';
import grid from '../../images/grid.png';
import '../../styles/profile_posts.css';
import { useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../../api/api.js';

function ProfilePosts() {
    const BASE_URL='https://localhost:7101';
    const [posts, setPosts] = useState([]); // State to hold posts data
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("userid"); // Get user ID from localStorage
        const url = `${ENDPOINTS.userPosts}/${userId}/posts`; // Construct the endpoint

        createAPIEndpoint(url)
            .fetch()
            .then((response) => {
                console.log(response.data); // Log the response
                setPosts(response.data.Posts); // Set posts data
            })
            .catch((err) => {
                console.log(err); // Log the error
            });
    }, []);

    const sendToCreatePost = () => {
        navigate("/create-post");
    };

    return (
        <div className="profile-posts-page">
            {/* Header section */}
            <header className="header">
                <div className="icon book-icon"><a href="/profile-recipes"><img src={recipeIcon} alt="Recipes" /></a></div>
                <div className="icon " onClick={sendToCreatePost}><img src={addPost} alt="Add Post" /></div>
                <div className="icon grid-icon"><a href="/profile-posts"><img src={grid} alt="Grid" /></a></div>
            </header>

            {/* Image grid section */}
            <div className="image-grid">
                {posts.map((post, index) => (
                    post.MediaPaths.length > 0 && (
                        <div className="image-item" key={index} >
                            <img src={`${BASE_URL}${post.MediaPaths[0]}`} alt={`Post ${index + 1}`} />
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}

export default ProfilePosts;
