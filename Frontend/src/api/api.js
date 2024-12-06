import axios from 'axios';

// Base URL for the backend
export const BASE_URL = 'https://localhost:7101/';

// Define your API endpoints here
export const ENDPOINTS = {
    users: 'Registers',               // e.g., Get users
    stats:"Registers/user-stats",
    posts: 'Posts', 
    recipe:'Recipe',                 // e.g.,  Get posts
    userRecipe:"Recipe/User",
    userPosts:"Posts/user",
    postfeed:"Posts/feed",
    recipefeed:"Recipe/Recipefeed",
    recipemedia:"Recipe/RecipeMedia",
    updatelike:"Like/like",
    login: 'Login',                 // e.g., Login api
    bio: 'Bios',                 // e.g., Authentication endpoint
    profile: 'Profile',           // e.g., User profile
    reports: 'Reports',           // e.g., Reports endpoint
    isFollow:"Follow/isFollower",
    updatefollow:"Follow/follow",
    getnoti:"getnotifications",
    userStory:"Story/userStory",
    otherStory:"Story/user-stories",
    reciperating:"RecipeRatings",
    addcomments:"Comments",
};


export const createAPIEndpoint = (endpoint) => {
    let url = BASE_URL + 'api/' + endpoint + '/'; 
    return {
        
        fetch: (headers = {}) => axios.get(url, { headers }),

        fetchAll: (headers = {}) => axios.get(url, { headers }),

        
        fetchById: (id, headers = {}) => axios.get(url + id, { headers }),
        fetchByIdtwo: ({id,id2}, headers = {}) => axios.get(url + {id,id2}, { headers }),

        // Create a new record
        post: (newRecord, headers = {}) => axios.post(url, newRecord, { headers }),

        custompost:({newRecord,id},headers={})=>axios.post(url,{newRecord,id},{headers}),

        // Update a record by ID
        put: (id, updatedRecord, headers = {}) => axios.put(url + id, updatedRecord, { headers }),

        // Delete a record by ID
        delete: (id, headers = {}) => axios.delete(url + id, { headers }),

        // Custom post request (for scenarios like login or filtering)
        customPost: (data, customUrl, headers = {}) => axios.post(url + customUrl, data, { headers }),
    };
};
