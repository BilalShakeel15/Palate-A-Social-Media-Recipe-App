import React, { useEffect, useState } from 'react';
import Navbar from '../navbar.js';
import SearchDetail from './searchdetail.js';
import { createAPIEndpoint, ENDPOINTS } from '../../api/api.js';
import { useLocation } from 'react-router-dom';
import ProfileRecipes from '../profile_page/profile_recipes.js';
import Searchprofilerecipe from './searchprofilerecipe.js';
import '../../styles/lock.css';
import lock from '../../images/lock.png';  // Import the lock image

const Searchprofile = () => {
    const [stats, setstats] = useState(null);
    const { state } = useLocation(); // Access location state
    const { id } = state || {};
    const [check, setcheck] = useState(null); // Make sure check is initialized properly

    useEffect(() => {
        const temp = localStorage.getItem("userid");

        // Fetch user stats
        createAPIEndpoint(ENDPOINTS.stats)
            .fetchById(id)
            .then((response) => setstats(response.data))
            .catch((err) => console.log(err));

        // Check if the user is following the profile
        createAPIEndpoint(ENDPOINTS.isFollow)
            .fetchById(`${temp}/${id}`)
            .then((response) => setcheck(response.data))
            .catch((err) => console.log(err));

    }, [id]); // Dependency on id to re-fetch when it changes

    // Render loading state or error message until stats are fetched
    if (!stats || check === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <SearchDetail
                id={id}
                check={check}
                r_count={stats.RecipeCount ? stats.RecipeCount : 0}
                p_count={stats.PostCount ? stats.PostCount : 0}
                follower={stats.FollowerCount ? stats.FollowerCount : 0}
                following={stats.FollowingCount ? stats.FollowingCount : 0}
                l_count={stats.TotalLikes ? stats.TotalLikes : 0}
            />

            {/* Conditionally render Searchprofilerecipe or lock message */}
            {check.isFollower ? (
                <Searchprofilerecipe id={id}
                    check={check.isFollower}
                    r_count={stats.RecipeCount ? stats.RecipeCount : 0}
                    p_count={stats.PostCount ? stats.PostCount : 0}
                    follower={stats.FollowerCount ? stats.FollowerCount : 0}
                    following={stats.FollowingCount ? stats.FollowingCount : 0}
                    l_count={stats.TotalLikes ? stats.TotalLikes : 0}
                />
            ) : (
                <div className="lock-message">
                    <img src={lock} alt="Lock" className="lock-image" /> 
                    <p>You must follow this user to view their recipes.</p>
                </div>
            )}
        </div>
    );
};

export default Searchprofile;
