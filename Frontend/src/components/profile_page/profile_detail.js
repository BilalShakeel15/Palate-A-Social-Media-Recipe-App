import React, { useEffect } from 'react';
import '../../styles/profile_detail.css';
import defaultdp from '../../images/default_dp.jpg';
import { useState } from 'react';

const ProfileDetail = ({r_count,p_count,follower,following,l_count}) => {
    const BASE_URL='https://localhost:7101';
    const [biodata,setbiodata]=useState(null);
    console.log((r_count,p_count));
    

    useEffect(()=>{
        const bio=JSON.parse(localStorage.getItem("bioData"));
        setbiodata(bio);
    },[])
    return (
        <div className="profile-section">
            <div className="profile-info">
                <div className="profile-details">
                    <div className="profile-picture">
                        <img src={biodata?.dp ? `${BASE_URL}${biodata.dp}`:defaultdp} alt="Profile" />
                        <span className="add-icon">+</span>
                    </div>
                    <div className="profile-text">
                        <h4 className="username">{biodata?.Name? biodata.Name:"Name"}</h4>
                        <p className="fullname">{biodata?.Description? biodata.Description:"Description"}</p>
                        <p className="profession">{biodata?.Link? biodata.Link:"Link"} <span>❤️</span></p>
                        <a href="/edit-profile"><button className="edit-profile-btn">Edit Profile</button></a>
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
            <div className="settings-button">
                <button className="settings-btn">
                    <i className="fas fa-cog"></i> Settings
                </button>
            </div>
        </div>
    );
};

export default ProfileDetail;
