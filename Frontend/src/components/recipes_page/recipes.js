import React, { useEffect, useState } from 'react';
import Navbar from '../navbar.js';
import Recipe_Card from './recipe_card.js';
import RecipesNavbar from './recipes_navbar.js';
import '../../styles/recipes.css';
import { createAPIEndpoint, ENDPOINTS } from '../../api/api.js';
import { useNavigate } from 'react-router-dom';

const Recipes = () => {
  // State to store recipes data
  const navigate=useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('new');
  const [filteredRecipes, setFilteredRecipes] = useState([]);


  // Fetch recipes when the component mounts
  useEffect(() => {
    const userId = localStorage.getItem("userid");
    if (userId) {
      createAPIEndpoint(ENDPOINTS.recipefeed)
        .fetchById(userId)
        .then((response) => {
          setRecipes(response.data); // Store the complete list
          setFilteredRecipes(response.data); // Initialize the filtered list
        })
        .catch((err) => {
          console.error("Error fetching recipes:", err);
        });
    }
  }, []);
    // Empty dependency array to fetch only once when the component mounts

  // Handle category change (currently not used, but you can implement it to filter recipes)
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    console.log(category);
    
    if (category === 'new' ) {
      setFilteredRecipes(recipes); // Reset to all recipes if 'new' is selected
    } 
    else if(category === 'popular')
    {
      navigate('/temp')
    }
    else {
      const filtered = recipes.filter((recipe) => recipe.category.toLowerCase() === category.toLowerCase());
      setFilteredRecipes(filtered); // Update with filtered recipes
      console.log(filtered);
      
    }
  };
  

  return (
    <div>
      <Navbar />
      <RecipesNavbar onCategoryChange={handleCategoryChange} />
      <div className="container mt-4">
        <div className="row">
          {/* Map over the filtered recipes to display only the relevant ones */}
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe, index) => (
              <div className="col-md-4" key={index}>
                <Recipe_Card recipe={recipe} />
              </div>
            ))
          ) : (
            <p>No recipes available</p> // Show a message if no recipes are available
          )}
        </div>
      </div>
    </div>
  );
  
};

export default Recipes;
