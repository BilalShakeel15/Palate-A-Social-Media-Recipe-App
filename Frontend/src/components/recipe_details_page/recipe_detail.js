import React from 'react';
import { useLocation } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel'; // Import Carousel
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Carousel styles
import '../../styles/recipe_detail.css';
import Navbar from '../navbar.js';
import recipeImage from "../../images/RecipeDetailPic.png"; // Default image for fallback

function RecipeDetail() {
  const { state } = useLocation(); // Access location state
  const { recipe, recipemedia } = state || {}; // Get the passed recipe and recipemedia data

  if (!recipe) {
    return <div>No recipe details available</div>; // Fallback UI for missing data
  }

  // Ensure recipemedia exists and has at least one element
  const recipeMedia = recipemedia && recipemedia.length > 0 ? recipemedia : null;
  const test=()=>{
    console.log(recipeMedia);
    
  }

  return (
    <>
      <Navbar />
      <div className="recipe-detail-container">
        <h1 className="title">{recipe.Title || "Recipe Title"}</h1>
        <div className="recipe-detail">
          {/* Recipe Image/Video Section */}
          <div className="recipe-image-section" onClick={test}>
            {recipeMedia && recipeMedia.length > 1 ? (
              <Carousel 
                showThumbs={false} 
                dynamicHeight={false} 
                useKeyboardArrows={true} 
                emulateTouch={true}
                infiniteLoop
                showArrows={false}  
                showIndicators={true}  
                className="custom-carousel"
              >
                {recipeMedia.map((media, index) => (
                  <div key={index}>
                    {media.MediaType === 'Video' ? (
                      <video
                        controls
                        className="recipe-image"
                        src={`https://localhost:7101${media.MediaUrl}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = recipeImage; // Fallback to default image
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={media.MediaUrl ? `https://localhost:7101${media.MediaUrl}` : recipeImage}
                        alt={recipe.Title || "Recipe"}
                        className="recipe-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = recipeImage; // Fallback to default image
                        }}
                      />
                    )}
                  </div>
                ))}
              </Carousel>
            ) : recipeMedia ? (
              recipeMedia[0].MediaType === 'video' ? (
                <video
                  controls
                  className="recipe-video"
                  src={`https://localhost:7101${recipeMedia[0].MediaUrl}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = recipeImage; // Fallback to default image
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={recipeMedia[0]?.MediaUrl ? `https://localhost:7101${recipeMedia[0].MediaUrl}` : recipeImage}
                  alt={recipe.Title || "Recipe"}
                  className="recipe-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = recipeImage; // Fallback to default image
                  }}
                />
              )
            ) : (
              <img
                src={recipeImage}
                alt="Fallback Recipe"
                className="recipe-image"
              />
            )}
          </div>

          {/* Other Sections */}
          <div className="instructions-section">
            <h2>INSTRUCTIONS</h2>
            <p>{recipe.Instructions || "No instructions provided."}</p>
          </div>

          <div className="ingredients-section">
            <h2>INGREDIENTS</h2>
            <p>{recipe.Ingredients || "No Ingredients Available"}</p>
          </div>

          <div className="notes-section">
            <h2>NOTES</h2>
            <p>{recipe.Notes || "No additional notes available."}</p>
          </div>

          <div className="button-section">
            <div className="button">
              <i className="icon icon-time" /> {recipe.TimeInMinutes || "N/A"} mins
            </div>
            <div className="button">
              <i className="icon icon-easy" /> {recipe.Difficulty || "Easy"}
            </div>
            <div className="button">
              <i className="icon icon-serve" /> {recipe.Serves || "N/A"} people
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecipeDetail;
