import React from 'react';
import '../styles/hero.css';
import heroImage from '../images/hero-image.png'; 
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate=useNavigate();


  const move=()=>{
    navigate("/recipes/*");
  }
  return (
    <>
    <section className="hero">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="hero-text">
              <p className="hero-subtitle">Discover 100% organic</p>
              <h1 className="hero-title">SIMPLE AND TASTY RECIPES</h1>
              <button className="btn btn-light" style={{"maxWidth":"10vw"}} onClick={move}>Get Started</button>
            </div>
          </div>
          <div className="col-md-6">
            <img src={heroImage} alt="Hero" className="img-fluid hero-image" />
          </div>
        </div>
      </div>
    </section>
    <div className="hero-wave"></div>
    </>
  );
};

export default Hero;