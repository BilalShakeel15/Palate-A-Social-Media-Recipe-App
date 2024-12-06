import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login.js";
import Register from "./components/register.js";
import Home from "./components/home.js";
import Recipes from './components/recipes_page/recipes.js';
import Signup from './components/signup.js';
import RecipeDetail from './components/recipe_details_page/recipe_detail.js';
import Feed from './components/feed_page/feed.js'
import Profile from './components/profile_page/profile.js'
import Posts from './components/profile_page/posts.js'
import EditProfile from './components/profile_page/edit_profile.js'
import Add_recipe from './components/create_recipe/Add_recipe.js'
import './App.css';
import Add_post from "./components/create_post/Add_post.js";
import Searchprofile from "./components/searchedprofile/searchprofile.js";
import Searchprofilepost from "./components/searchedprofile/searchprofilepost.js";
import About from "./components/about/about.js";
import RecipeList from "./components/recipes_page/RecipeList.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/temp" element={<RecipeList />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/recipes/*" element={<Recipes />} />
          <Route path="/details" element={<RecipeDetail />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile-recipes" element={<Profile />} />
          <Route path="/profile-posts" element={<Posts />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/create-recipe" element={<Add_recipe />} />
          <Route path="/create-post" element={<Add_post />} />
          <Route path="/search-profile" element={<Searchprofile />} />
          <Route path="/search-post" element={<Searchprofilepost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
