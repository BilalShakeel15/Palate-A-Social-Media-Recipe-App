import React, { useEffect, useState } from 'react';
import recipeIcon from '../../images/recipe_icon.png';
import addPost from '../../images/add_post.png';
import grid from '../../images/grid.png';
import '../../styles/profile_posts.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../../api/api.js';
import Navbar from '../navbar.js';
import Searchdetail from './searchdetail.js';
import Searchprofile from './searchprofile.js';

function Searchprofilepost() {
    const {state}=useLocation();
    const {id,check, r_count,p_count,follower,following,l_count}=state || {};
    const BASE_URL='https://localhost:7101';
    const [posts, setPosts] = useState([]); // State to hold posts data
    const navigate = useNavigate();

    useEffect(() => {
        const userId = id; // Get user ID from localStorage
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
    const move=()=>{
        navigate('/search-profile',{state:{id}});
    }

    return (
        <>
        <Navbar/>
        <Searchdetail
                id={id}
                check={check}
                r_count={r_count}
                p_count={p_count}
                follower={follower}
                following={following}
                l_count={l_count}
            />
        <div className="profile-posts-page">
            {/* Header section */}
            <header className="header">
                <div className="icon book-icon"><a onClick={move}><img src={recipeIcon} alt="Recipes" /></a></div>
                {/* <div className="icon " onClick={sendToCreatePost}><img src={addPost} alt="Add Post" /></div> */}
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
        </>
    );
}

export default Searchprofilepost;
