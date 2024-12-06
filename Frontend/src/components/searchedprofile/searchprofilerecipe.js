import React, { useEffect, useState } from 'react';
import '../../styles/profile_recipes.css';
import RecipeCard from '../recipes_page/recipe_card.js';
import recipeIcon from '../../images/recipe_icon.png';
import addPost from '../../images/add_post.png';
import grid from '../../images/grid.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../../api/api.js';

const Searchprofilerecipe = ({id,check, r_count,p_count,follower,following,l_count}) => {
    
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState(null); // To store the fetched recipes
    const [loading, setLoading] = useState(true); // To track loading state
    const [error, setError] = useState(null); // To track any errors

    // Fetch recipes when the component mounts
    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.userRecipe)
            .fetchById(id) // Fetch recipes by user ID
            .then((response) => {
                setRecipes(response.data); // Store the fetched recipes
                setLoading(false); // Stop loading
            })
            .catch((error) => {
                console.error('Error fetching recipes:', error);
                setError('Failed to load recipes.');
                setLoading(false);
            });
    }, []);

    const move=()=>{
        navigate('/search-post',{state:{id,check, r_count,p_count,follower,following,l_count}})
    }
    const searchrecipe=()=>{
        navigate('search-profile',{state:{id}})
    }

    // Render the component
    return (
        <div className="profile-posts-page">
            {/* Header section */}
            <header className="header">
                <div className="icon book-icon">
                    <a onClick={searchrecipe}>
                        <img src={recipeIcon} alt="Recipes Icon" />
                    </a>
                </div>
                {/* <div className="icon " onClick={addPostPage}>
                    <img src={addPost} alt="Add Post" />
                </div> */}
                <div className="icon grid-icon" onClick={move}>
                    <a >
                        <img src={grid} alt="Grid Icon" />
                    </a>
                </div>
            </header>

            {/* Main content section */}
            <div className="recipe-cards-container">
                {loading && <p></p>} 
                {error && <p className="error-message"></p>} {/* Error message */}
                {recipes && recipes.length > 0 ? (
                    recipes.map((recipe, index) => (
                        <RecipeCard recipe={recipe} key={index} />
                    ))
                ) : (
                    !loading && <p>No recipes found.</p> // Message if no recipes
                )}
            </div>

            {/* Add Recipe Button */}
            
        </div>
    );
};

export default Searchprofilerecipe;
