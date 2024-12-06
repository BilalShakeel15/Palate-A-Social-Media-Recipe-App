import React, { useEffect, useState } from "react";
import Recipe_Card from "./recipe_card.js";
import { createAPIEndpoint, ENDPOINTS } from "../../api/api.js";
import { useLocation } from "react-router-dom";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const location = useLocation();
  const userId = localStorage.getItem("userid");

  // Fetch recipes and their average ratings
  useEffect(() => {
    const fetchRecipesWithRatings = async () => {
      try {
        // Fetch recipes
        const response = await createAPIEndpoint(ENDPOINTS.recipefeed).fetchById(userId);
        const recipesData = response.data;

        // Fetch ratings for each recipe
        const recipesWithRatings = await Promise.all(
          recipesData.map(async (recipe) => {
            const avgRating = await fetchAverageRating(recipe.RecipeId);
            return { ...recipe, avgRating };
          })
        );

        setRecipes(recipesWithRatings);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    fetchRecipesWithRatings();
  }, [userId]);

  const fetchAverageRating = async (recipeId) => {
    try {
      const response = await fetch(
        `https://localhost:7101/api/RecipeRatings/GetAverageRating/${recipeId}`
      );
      const avgRating = await response.json();
      return avgRating || 0;
    } catch (error) {
      console.error("Error fetching average rating:", error);
      return 0;
    }
  };

  // Filter recipes based on location.pathname
  useEffect(() => {
    if (location.pathname === "/recipes/popular") {
      // Filter only recipes with avgRating > 0
      const popularRecipes = recipes.filter((recipe) => recipe.avgRating > 0);
      setFilteredRecipes(popularRecipes);
    } else {
      setFilteredRecipes(recipes); // Show all recipes
    }
  }, [recipes, location.pathname]);

  return (
    <div className="recipe-list">
      {filteredRecipes.map((recipe) => (
        <Recipe_Card key={recipe.RecipeId} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeList;
