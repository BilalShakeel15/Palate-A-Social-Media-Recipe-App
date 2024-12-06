import React from 'react';
import Recipe_Card from './recipes_page/recipe_card.js'; // Import the Recipe_Card component
import '../styles/recipe.css';

// Array of top recipes
const topRecipes = [
  {
    image: null, // Default image will be used
    title: "Rice and Chickpea Bowl",
    description: "A hearty and nutritious Rice Chickpea Bowl packed with protein, veggies, and bold flavors.",
    time: "45 mins",
    complexity: "Easy",
    people: "2"
  },
  {
    image: null, // Default image will be used
    title: "Pasta Primavera",
    description: "A light and fresh pasta dish with seasonal vegetables.",
    time: "30 mins",
    complexity: "Medium",
    people: "3"
  },
  {
    image: null, // Default image will be used
    title: "Grilled Chicken Salad",
    description: "A healthy salad with grilled chicken, fresh greens, and a tangy dressing.",
    time: "25 mins",
    complexity: "Easy",
    people: "2"
  }
];

const Recipe = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        {/* Use map to render Recipe_Card for each recipe */}
        {topRecipes.map((recipe, index) => (
          <div className="col-md-4 mb-4" key={index}>
            {/* <Recipe_Card recipe={recipe} /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipe;
