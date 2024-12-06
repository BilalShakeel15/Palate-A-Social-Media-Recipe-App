import React, { useState } from 'react';
import Navbar from '../navbar.js';
import '../../styles/Add_recipe.css';
import { createAPIEndpoint, ENDPOINTS } from '../../api/api.js';

const AddRecipe = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    ingredients: '',
    notes: '',
    timeInMinutes: '',
    difficulty: '',
    serves: '',
    category: '', // Add category to state
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // Remove a selected file
  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    // Create a FormData object to match the RecipeDto structure
    const recipeData = new FormData();
    recipeData.append('UserId', localStorage.getItem('userid'));
    recipeData.append('title', formData.title);
    recipeData.append('description', formData.description || '');
    recipeData.append('instructions', formData.instructions || '');
    recipeData.append('ingredients', formData.ingredients || '');
    recipeData.append('notes', formData.notes || '');
    recipeData.append('timeInMinutes', formData.timeInMinutes);
    recipeData.append('difficulty', formData.difficulty);
    recipeData.append('serves', formData.serves);
    recipeData.append('category', formData.category); // Append category

    // Add files to the FormData object
    selectedFiles.forEach((file) => {
      recipeData.append('mediaFiles', file);
    });

    createAPIEndpoint(ENDPOINTS.recipe)
      .post(recipeData)
      .then((response) => {
        alert(response);
      })
      .catch((error) => {
        alert(error);
      });

    // Reset form and files
    setFormData({
      title: '',
      description: '',
      instructions: '',
      ingredients: '',
      notes: '',
      timeInMinutes: '',
      difficulty: '',
      serves: '',
      category: '',
    });
    setSelectedFiles([]);
  };

  return (
    <>
      <Navbar />

      <div className="add-recipe-container">
        <div className="recipe-header d-flex justify-content-center align-items-center">
          <h1 style={{ color: 'white', textAlign: 'center' }}>Showcase Your Recipes</h1>
        </div>

        <form className="add-recipe-form" onSubmit={handleSubmit}>
          <div className="add-recipe-section">
            <h3>Description</h3>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="Recipe Title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                placeholder="Recipe Description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Instructions</label>
              <textarea
                name="instructions"
                placeholder="Recipe Instructions"
                rows="3"
                value={formData.instructions}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Ingredients</label>
              <textarea
                name="ingredients"
                placeholder="Ingredients"
                rows="3"
                value={formData.ingredients}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                placeholder="Notes"
                rows="2"
                value={formData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Time (in minutes)</label>
              <input
                type="number"
                name="timeInMinutes"
                placeholder="Time in Minutes"
                value={formData.timeInMinutes}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Difficulty</label>
              <input
                type="text"
                name="difficulty"
                placeholder="Difficulty Level"
                value={formData.difficulty}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Serving Size</label>
              <input
                type="number"
                name="serves"
                placeholder="Serving Size"
                value={formData.serves}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch/Dinner">Lunch/Dinner</option>
                <option value="Drinks">Drinks</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>
          </div>

          <div className="add-recipe-section">
            <h3>Upload Media</h3>
            <div className="form-group">
              <label>Upload Images</label>
              <input type="file" multiple onChange={handleFileChange} />
              <div className="image-preview-container">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="image-preview">
                    <p>{file.name}</p>
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeFile(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="add-recipes-btn">Add Recipe</button>
        </form>
      </div>
    </>
  );
};

export default AddRecipe;
