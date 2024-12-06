import React, { useState } from 'react';
import Navbar from '../navbar.js';
import '../../styles/Add_post.css'; // Adjust the CSS file name as needed
import { createAPIEndpoint, ENDPOINTS } from '../../api/api.js'; // Import API configuration
import axios from 'axios'; // Ensure axios is installed for making HTTP requests

const Add_post = () => {
  const [formData, setFormData] = useState({
    caption: '',
    type: 'food', // Default value
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Remove a selected file
  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = new FormData();
    postData.append('UserId', localStorage.getItem("userid"));
    postData.append('caption', formData.caption);
    postData.append('type', formData.type);

    selectedFiles.forEach((file) => {
      postData.append('mediaFiles', file); // Matches the backend property
    });

    createAPIEndpoint(ENDPOINTS.posts)
      .post(postData)
      .then((response) => alert(response.data))
      .catch((error) => alert(error));

    setFormData({
      caption: '',
      type: 'food',
    });
    setSelectedFiles([]);
  };

  return (
    <>
      <Navbar />
      <div className="add-post-container">
        <div className="addpost-header d-flex justify-content-center align-items-center">
          <h1 style={{ color: 'white', textAlign: 'center' }}>Click, Post & Eat</h1>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Caption Input */}
          <div className="form-group">
            <label htmlFor="caption">Caption:</label>
            <input
              type="text"
              id="caption"
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Type Select Dropdown */}
          <div className="form-group">
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="food">Food</option>
              <option value="random">Random</option>
            </select>
          </div>

          {/* Media Files Input */}
          <div className="form-group">
            <label htmlFor="mediaFiles">Media Files:</label>
            <input
              type="file"
              id="mediaFiles"
              name="mediaFiles"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Submit Post
          </button>
        </form>

        {/* Preview selected files */}
        {selectedFiles.length > 0 && (
          <div className="file-preview">
            <h3>Selected Files:</h3>
            <div className="preview-grid">
              {selectedFiles.map((file, index) => (
                <div key={index} className="preview-item">
                  {file.type.startsWith('image') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="preview-image"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="preview-video"
                    />
                  )}
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemoveFile(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Add_post;
