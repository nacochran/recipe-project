// WelcomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import recipeBackground from '../images/welcome-image.jpg';

function WelcomePage() {
  return (
    <div>
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