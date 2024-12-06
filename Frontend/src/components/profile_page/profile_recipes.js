import React, { useEffect, useState } from 'react';
import '../../styles/profile_recipes.css';
import RecipeCard from '../recipes_page/recipe_card.js';
import recipeIcon from '../../images/recipe_icon.png';
import addPost from '../../images/add_post.png';
import grid from '../../images/grid.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { createAPIEndpoint, ENDPOINTS } from '../../api/api.js';

const ProfileRecipes = () => {
    // const { state } = useLocation(); // Access location state
    // const { id } = state || {};
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState(null); // To store the fetched recipes
    const [loading, setLoading] = useState(true); // To track loading state
    const [error, setError] = useState(null); // To track any errors

    // Fetch recipes when the component mounts
    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.userRecipe)
            .fetchById(localStorage.getItem('userid')) // Fetch recipes by user ID
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

    const addPostPage = () => {
        navigate('/create-post'); // Navigate to the recipe creation page
    };
    const addRecipePage = () => {
        navigate('/create-recipe'); // Navigate to the recipe creation page
    };

    // Render the component
    return (
        <div className="profile-posts-page">
            {/* Header section */}
            <header className="header">
                <div className="icon book-icon">
                    <a href="/profile-recipes">
                        <img src={recipeIcon} alt="Recipes Icon" />
                    </a>
                </div>
                <div className="icon " onClick={addPostPage}>
                    <img src={addPost} alt="Add Post" />
                </div>
                <div className="icon grid-icon">
                    <a href="/profile-posts">
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
                    !loading && <p>No recipes found. Add one!</p> // Message if no recipes
                )}
            </div>

            {/* Add Recipe Button */}
            <button className="add-recipe-btn" onClick={addRecipePage}>
                ADD RECIPE
            </button>
        </div>
    );
};

export default ProfileRecipes;
