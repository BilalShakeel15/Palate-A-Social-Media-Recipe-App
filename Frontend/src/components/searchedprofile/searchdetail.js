import React, { useEffect, useState } from 'react';
import '../../styles/profile_detail.css';
import defaultdp from '../../images/default_dp.jpg';
import { createAPIEndpoint, ENDPOINTS } from '../../api/api.js';
import axios from 'axios';
const Searchdetail = ({ id, check, r_count, p_count, follower, following, l_count }) => {
    const BASE_URL = 'https://localhost:7101';
    const [biodata, setbiodata] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [followStatus, setFollowStatus] = useState(""); // Store the button label

    // Update follow status based on the `check` prop
    useEffect(() => {
        if (check.isFollower === false && check.isRequested === false) {
            setFollowStatus("Follow");
        } else if (check.isFollower === false && check.isRequested === true) {
            setFollowStatus("Requested");
        } else {
            setFollowStatus("Unfollow");
        }
    }, [check]);

    // Fetch bio data
    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.bio)
            .fetchById(id)
            .then((response) => {
                setbiodata(response.data || null);
            })
            .catch((err) => {
                console.error("Error fetching bio data:", err);
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    

const toggleFollow = () => {
    const followedUserId = id;  // The user you're following
    const followerUserId = localStorage.getItem("userid");  // The logged-in user
    console.log(followedUserId, followerUserId);

    const apiUrl = `https://localhost:7101/api/Follow/follow/${followedUserId}/${followerUserId}`;

    if (followStatus === "Follow") {
        // Send follow request
        axios.post(apiUrl)
            .then(() => {
                setFollowStatus("Requested"); // Update state
            })
            .catch((err) => console.error("Error following user:", err));
    } else if (followStatus === "Unfollow") {
        // Unfollow user
        axios.delete(`https://localhost:7101/api/Follow/unfollow/${followedUserId}/${followerUserId}`)
            .then(() => {
                setFollowStatus("Follow"); // Update state
            })
            .catch((err) => console.error("Error unfollowing user:", err));
    }
};


    if (isLoading) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="profile-section">
            <div className="profile-info">
                <div className="profile-details">
                    <div className="profile-picture">
                        <img src={biodata?.dp ? `${BASE_URL}${biodata.dp}` : defaultdp} alt="Profile" />
                    </div>
                    <div className="profile-text">
                        <h4 className="username">{biodata?.Name || "Name not available"}</h4>
                        <p className="fullname">{biodata?.Description || "No description available"}</p>
                        <p className="profession">
                            {biodata?.Link || "No link provided"} <span>❤️</span>
                        </p>
                        <button className="edit-profile-btn" onClick={toggleFollow}>
                            {followStatus}
                        </button>
                    </div>
                </div>
                <div className="profile-stats">
                    <div className="stat">
                        <strong>{r_count}</strong>
                        <span>Recipe</span>
                    </div>
                    <div className="stat">
                        <strong>{p_count}</strong>
                        <span>Posts</span>
                    </div>
                    <div className="stat">
                        <strong>{follower}</strong>
                        <span>Followers</span>
                    </div>
                    <div className="stat">
                        <strong>{following}</strong>
                        <span>Following</span>
                    </div>
                    <div className="stat">
                        <strong>{l_count}</strong>
                        <span>Likes</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Searchdetail;
