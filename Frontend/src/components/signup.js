import React, { useState } from 'react';
import '../styles/signup.css';
import logo from '../images/logo.png'
import { ENDPOINTS, createAPIEndpoint } from '../api/api.js';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
    Answer1: '',
    Answer2: '',
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.Password.length < 6) {
      setError('Password must be at least 6 characters long');
    } else {
      setError('');
      // Add form submission logic here (e.g., sending data to the server)
      console.log(JSON.stringify(formData, null, 2));

      createAPIEndpoint(ENDPOINTS.users)
        .post(formData)
        .then((response) => {
          console.log(response);
          setFormData({
            Username: '',
            Password: '',
            Answer1: '',
            Answer2: '',
          })
          navigate("/");

        })
        .catch((error) => {
          console.error('Error:', error.response ? error.response.data : error.message);
          if (error.response && error.response.data.errors) {
            console.error('Validation Errors:', error.response.data.errors);
          }
          setError('Failed to create account. Please try again.');
        });
    }
  };

  return (
    <div className="signup-container">
      {/* Logo at top-right corner */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="signup-left">
        <h1>SIGN UP TO PALATE</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Enter username and password</label>
          <input
            type="text"
            name="Username"
            placeholder="Username"
            value={formData.Username}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="Password"
            placeholder="Password"
            value={formData.Password}
            onChange={handleInputChange}
            required
          />
          {error && <p className="error">{error}</p>}

          <label htmlFor="nickname">Answer these security questions</label>
          <input
            type="text"
            name="Answer1"
            placeholder="What is your nickname?"
            value={formData.Answer1}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="Answer2"
            placeholder="What is your favorite movie?"
            value={formData.Answer2}
            onChange={handleInputChange}
            required
          />

          <button type="submit" className="create-account-button">CREATE ACCOUNT</button>
        </form>
      </div>

      <div className="signup-right">
        <h2>READY TO COOK?</h2>
        <p>Enter your email and password to cook easy and tasty recipes.</p>
        <a href="/"><button className="signin-button">SIGN IN</button></a>
      </div>
    </div>
  );
};

export default Signup;
