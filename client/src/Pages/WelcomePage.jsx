// WelcomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import recipeBackground from '../images/welcome-image.jpg';

function WelcomePage() {
  async function get_recipes() {
    console.log("Testing...");

    try {
      const response = await fetch('/recipes?tag=test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tags: [''], // test tags
          search_query: "Recipes...",
          cookTime: 25,
          average_rating: 4.5
        })
      });
  
      const result = await response.json();
      if (result.error) {
        alert('Error: ' + result.error);
      } else {
        console.log(result);
      }
    } catch (err) {
      console.error('Error getting recipes: ', err);
    }
  }

  return (
    <div>
      <button style={{backgroundColor: "red" }} onClick={get_recipes}>
            test 
          </button>
      <div
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${recipeBackground})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <h1 className="text-white text-5xl font-bold">Welcome to the Recipe Project!</h1>
          
          <p className="text-white mt-4">
            <Link to="/login" className="text-yellow-500 underline">Login</Link> or
            <Link to="/register" className="text-yellow-500 underline mx-1">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;