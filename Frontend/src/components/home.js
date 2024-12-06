import React, { useState, useEffect } from 'react';
import Navbar from './navbar.js';
import Hero from './hero.js';
import Search from './search.js';
import Recipe from './recipe.js';
import "../styles/home.css";

// Spinner Component
const Spinner = () => {
    return (
        <div className="spinner-container">
            <div className="spinner"></div>
        </div>
    );
};

const Home = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a loading delay of 1 second
        const timer = setTimeout(() => {
            setLoading(false);  // After 1 second, stop loading
        }, 500);

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, []);

    return (
        <div>
            {loading ? (
                <Spinner />  // Show spinner while loading
            ) : (
                <>
                    <Navbar />
                    <Hero />
                    <Search />
                    <Recipe />
                </>
            )}
        </div>
    );
};

export default Home;
