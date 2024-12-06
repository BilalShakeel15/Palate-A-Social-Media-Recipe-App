import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/recipes_navbar.css';
import moreIcon from '../../images/more-icon.png'; // Ensure you have the more icon image in your project
import closeIcon from '../../images/close.png'; 

const RecipesNavbar = ({ onCategoryChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Regular navbar that disappears on smaller screens */}
      <div className={`recipes-navbar ${menuOpen ? 'hide-navbar' : ''}`}>
        <ul>
          <li>
            <NavLink to="/recipes/new" activeClassName="active" onClick={() => onCategoryChange('new')}>
              New
            </NavLink>
          </li>
          <li>
            <NavLink to="/recipes/popular" activeClassName="active" onClick={() => onCategoryChange('popular')}>
              Popular
            </NavLink>
          </li>
          <li>
            <NavLink to="/recipes/breakfast" activeClassName="active" onClick={() => onCategoryChange('breakfast')}>
              Breakfast
            </NavLink>
          </li>
          <li>
            <NavLink to="/recipes/lunch-dinner" activeClassName="active" onClick={() => onCategoryChange('lunchDinner')}>
              Lunch/Dinner
            </NavLink>
          </li>
          <li>
            <NavLink to="/recipes/desserts" activeClassName="active" onClick={() => onCategoryChange('desserts')}>
              Desserts
            </NavLink>
          </li>
          <li>
            <NavLink to="/recipes/drinks" activeClassName="active" onClick={() => onCategoryChange('drinks')}>
              Drinks
            </NavLink>
          </li>
        </ul>
      </div>

      {/* More icon for smaller screens */}
      <div className="more-icon-container">
        <img src={moreIcon} alt="More" className="more-icon" onClick={toggleMenu} />
      </div>

      {/* Sliding menu */}
      <div className={`sliding-menu ${menuOpen ? 'menu-open' : ''}`}>
        {/* Close icon */}
        <div className="close-icon-container" onClick={closeMenu}>
          <img src={closeIcon} alt="Close" className="close-icon" />
        </div>
        <ul>
          <li>
            <NavLink to="/recipes/new" activeClassName="active" onClick={() => onCategoryChange('new')}>
              New
            </NavLink>
          </li>
          <li>
            <NavLink to="/recipes/popular" activeClassName="active" onClick={() => onCategoryChange('popular')}>
              Popular
            </NavLink>
          </li>
          <li>
            <NavLink to="/recipes/breakfast" activeClassName="active" onClick={() => onCategoryChange('breakfast')}>
              Breakfast
            </NavLink>
          </li>
          <li>
            <NavLink to="/recipes/lunch-dinner" activeClassName="active" onClick={() => onCategoryChange('lunchDinner')}>
              Lunch/Dinner
            </NavLink>
          </li>
          <li>
            <NavLink to="/recipes/desserts" activeClassName="active" onClick={() => onCategoryChange('desserts')}>
              Desserts
            </NavLink>
          </li>
          <li>
            <NavLink to="/recipes/drinks" activeClassName="active" onClick={() => onCategoryChange('drinks')}>
              Drinks
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default RecipesNavbar;
