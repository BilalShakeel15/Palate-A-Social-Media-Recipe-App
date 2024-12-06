import React, { useState } from 'react';
import '../styles/login.css';
import logo from '../images/logo.png';
import { createAPIEndpoint,ENDPOINTS } from '../api/api.js';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // State to store email and password
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    Username: '',
    Password: ''
  });

  // Handler for input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    createAPIEndpoint(ENDPOINTS.login)
    .post(formData)
    .then((response)=>{
      if(response.data)
      {
        console.log("Login");
        localStorage.setItem("userid",response.data.Id);
        localStorage.setItem("username",response.data.Username);
        createAPIEndpoint(ENDPOINTS.bio)
        .fetchById(response.data.Id)
        .then((res)=>localStorage.setItem("bioData", JSON.stringify(res.data)))
        .catch((err)=>console.log(err))
        
        navigate('/home');
      }
      
    })
    .catch((error)=>{
      console.log(error);
      
    })
  };

  return (
    <div className="login-wrapper tempLogin">
      <div className="login-left">
        <div className="login-header">
          <img src={logo} alt="Palate Logo" className="palate-logo" />
        </div>

        <div className="login-form">
          <h2>LOG IN TO PALATE</h2>
          <p>Enter username and password</p>

          <div className="input-group">
            <label htmlFor="text">
              <i className="fas fa-envelope"></i> Username
            </label>
            <input
              type="text"
              id="Username"
              className="input-field"
              placeholder="username"
              value={formData.Username}
              onChange={handleInputChange}  // Update state on change
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              <i className="fas fa-key"></i> PASSWORD
            </label>
            <input
              type="password"
              id="Password"
              className="input-field"
              placeholder="Password"
              value={formData.Password}
              onChange={handleInputChange}  // Update state on change
            />
          </div>

          {/* <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div> */}

          <button 
            className="btn-signin" 
            onClick={handleSubmit} // Attach the handleSubmit to the button's onClick
          >
            LOG IN
          </button>
        </div>
      </div>

      <div className="login-right">
        <h2>READY TO COOK?</h2>
        <p>Enter your personal details and start your journey with us.</p>
        <a href="/signup"><button className="btn-signup">SIGN UP</button></a>
      </div>
    </div>
  );
};

export default Login;
