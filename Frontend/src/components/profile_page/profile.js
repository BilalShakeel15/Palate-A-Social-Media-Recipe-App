import React, { useEffect, useState } from 'react';
import Navbar from '../navbar.js';
import ProfileDetail from './profile_detail.js';
import ProfilePosts from './profile_recipes.js';
import { createAPIEndpoint, ENDPOINTS } from '../../api/api.js';

const Profile = () => {
    const [stats, setstats] = useState(null);

    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.stats)
            .fetchById(localStorage.getItem("userid"))
            .then((response) => setstats(response.data))
            .catch((err) => console.log(err));
    }, []);

    // Render loading state or error message until stats are fetched
    if (!stats) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <ProfileDetail 
                r_count={stats.RecipeCount ? stats.RecipeCount : 0}
                p_count={stats.PostCount ? stats.PostCount : 0}
                follower={stats.FollowerCount ? stats.FollowerCount : 0}
                following={stats.FollowingCount ? stats.FollowingCount : 0}
                l_count={stats.TotalLikes ? stats.TotalLikes : 0}
            />
            <ProfilePosts />
        </div>
    );
};

export default Profile;
