import React, { useState, useEffect } from 'react';
import '../styles/search.css';
import welcomeImage from '../images/welcome.png'; 
import newIcon from '../images/new_icon.png'; 
import popularIcon from '../images/popular_icon.png'; 
import breakfastIcon from '../images/breakfast_icon.png'; 
import lunchIcon from '../images/lunch_icon.png'; 
import dessertIcon from '../images/dessert_icon.png'; 
import drinksIcon from '../images/drinks_icon.png'; 
import { createAPIEndpoint, ENDPOINTS } from '../api/api.js'; // Assuming this is the API call setup
import Recipe_Card from './recipes_page/recipe_card.js'; // Assuming Recipe_Card is the component where recipes are displayed

const Search = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  // Fetch recipe feed when component mounts
  useEffect(() => {
    const userId = localStorage.getItem("userid");
    if (userId) {
      createAPIEndpoint(ENDPOINTS.recipefeed)
        .fetchById(userId)
        .then((response) => {
          setRecipes(response.data); // Store the complete list
          setFilteredRecipes([]); // Initialize with no filtered recipes
        })
        .catch((err) => {
          console.error("Error fetching recipes:", err);
        });
    }
  }, []);

  // Handle category click and filter recipes based on the selected category
  const handleClick = (category) => {
    console.log(`${category} clicked`);
    
    const filtered = recipes.filter((recipe) => recipe.category.toLowerCase() === category.toLowerCase());
    setFilteredRecipes(filtered);
  };

  return (
    <section className="search-section">
      <div className="container">
        {/* Render Categories if no category is selected */}
        {filteredRecipes.length === 0 && (
          <div className="row justify-content-center">
            {/* New */}
            <div className="col-6 col-md-4 col-lg-2 mb-4">
              <div className="search-circle green" onClick={() => handleClick('New')}>
                <img src={newIcon} alt="New" />
              </div>
              <p className="text-center search-labels">NEW</p>
            </div>

            {/* Popular */}
            <div className="col-6 col-md-4 col-lg-2 mb-4">
              <div className="search-circle red" onClick={() => handleClick('Popular')}>
                <img src={popularIcon} alt="Popular" />
              </div>
              <p className="text-center search-labels">POPULAR</p>
            </div>

            {/* Breakfast */}
            <div className="col-6 col-md-4 col-lg-2 mb-4">
              <div className="search-circle green" onClick={() => handleClick('Breakfast')}>
                <img src={breakfastIcon} alt="Breakfast" />
              </div>
              <p className="text-center search-labels">BREAKFAST</p>
            </div>

            {/* Lunch/Dinner */}
            <div className="col-6 col-md-4 col-lg-2 mb-4">
              <div className="search-circle red" onClick={() => handleClick('Lunch/Dinner')}>
                <img src={lunchIcon} alt="Lunch/Dinner" />
              </div>
              <p className="text-center search-labels">LUNCH/DINNER</p>
            </div>

            {/* Desserts */}
            <div className="col-6 col-md-4 col-lg-2 mb-4">
              <div className="search-circle green" onClick={() => handleClick('Desserts')}>
                <img src={dessertIcon} alt="Desserts" />
              </div>
              <p className="text-center search-labels">DESSERTS</p>
            </div>

            {/* Drinks */}
            <div className="col-6 col-md-4 col-lg-2 mb-4">
              <div className="search-circle red" onClick={() => handleClick('Drinks')}>
                <img src={drinksIcon} alt="Drinks" />
              </div>
              <p className="text-center search-labels">DRINKS</p>
            </div>
          </div>
        )}

        {/* Render the filtered recipes */}
        {filteredRecipes.length > 0 && (
          <div className="row justify-content-center">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.RecipeId} className="col-12 col-md-6 col-lg-4 mb-4">
                <Recipe_Card recipe={recipe} />
              </div>
            ))}
          </div>
        )}

        {/* Show a message if no recipes found for the selected category */}
        {filteredRecipes.length === 0 && (
          <p className="text-center"></p>
        )}
      </div>
    </section>
  );
};

export default Search;
