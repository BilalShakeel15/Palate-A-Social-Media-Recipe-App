import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/recipe.css';
import recipeImage from '../../images/recipe-image.png'; // Default image
import shareImage from '../../images/share_icon.png';
import saveImage from '../../images/save_icon.png';
import timeImage from '../../images/time_icon.png';
import complexityImage from '../../images/complexity_icon.png';
import peopleImage from '../../images/People_icon.png';
import { createAPIEndpoint, ENDPOINTS } from "../../api/api.js";

const Recipe_Card = ({ recipe }) => {
  const navigate = useNavigate();
  const [recipemedia, setmedia] = useState(null);
  const [rating, setRating] = useState(0); // User's rating
  const [hoverRating, setHoverRating] = useState(0); // Hover effect
  const [avgRating, setAvgRating] = useState(0); // Average rating

  useEffect(() => {
    // Fetch recipe media
    createAPIEndpoint(ENDPOINTS.recipemedia)
      .fetchById(recipe.RecipeId)
      .then((response) => setmedia(response.data));

    // Fetch user's existing rating
    const userId = localStorage.getItem("userid");
    fetch(`https://localhost:7101/api/RecipeRatings/userRating/${recipe.RecipeId}/${userId}`)
      .then((response) => response.json())
      .then((data) => setRating(data || 0)) // Assume the API returns user's rating
      .catch((err) => console.error("Error fetching user's rating:", err));



    fetch(`https://localhost:7101/api/RecipeRatings/GetAverageRating/${recipe.RecipeId}`)
      .then((response) => response.json())
      .then((data) => setAvgRating(data || 0)) // Assume the API returns average rating
      .catch((err) => console.error("Error fetching average rating:", err));
  }, [recipe.RecipeId]);

  const BASE_URL = 'https://localhost:7101';

  const recipeImageUrl = recipemedia && recipemedia.length > 0
    ? `${BASE_URL}${recipemedia[0].MediaUrl}`
    : recipeImage;

  const handleCardClick = () => {
    navigate('/details', { state: { recipe, recipemedia } });
  };

  const handleStarClick = async (index) => {
    setRating(index); // Update UI immediately

    const ratingData = {
      RecipeId: recipe.RecipeId,
      UserId: localStorage.getItem("userid"),
      Rating: index
    };
    console.log(rating);


    try {
      const response = await fetch('https://localhost:7101/api/RecipeRatings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Rating posted successfully', result);
        // Optionally refetch average rating after posting
        fetch(`https://localhost:7101/api/RecipeRatings/${recipe.RecipeId}/average`)
          .then((response) => response.json())
          .then((data) => setAvgRating(data.average || 0));
      } else {
        const error = await response.json();
        console.error('Error posting rating:', error);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          style={{
            cursor: 'pointer',
            color: i <= (hoverRating || rating) ? '#A6CE39' : '#d3d3d3',
            fontSize: '24px',
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div
      className="card recipe-card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      
        <img
          src={recipeImageUrl}
          className="card-img-top recipe-img"
          alt={recipe.Title || "Recipe"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = recipeImage;
          }}

        />
      
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="rating" onClick={(e) => e.stopPropagation()}>
            {renderStars()}
          </div>
          <div className="avg-rating">
            <span style={{ fontSize: '16px', color: '#555' }}>
              Avg: {avgRating.toFixed(1)}
            </span>
            {/* <img src={saveImage} alt="Save" className="icon" /> */}
          </div>
        </div>
        <h5 className="card-title">{recipe.Title || "Recipe Title"}</h5>
        <p className="card-text">{recipe.Description || "Description not available."}</p>
        <div className="d-flex justify-content-between align-items-center">
          <div className="info-icon">
            <img src={timeImage} alt="Time" className="info-icon-img" />
            <div className="info-text">{recipe.TimeInMinutes || "N/A"}</div>
          </div>
          <div className="info-icon">
            <img src={complexityImage} alt="Complexity" className="info-icon-img" />
            <div className="info-text">{recipe.Difficulty || "N/A"}</div>
          </div>
          <div className="info-icon">
            <img src={peopleImage} alt="People" className="info-icon-img" />
            <div className="info-text">{recipe.Serves || "N/A"} people</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipe_Card;
