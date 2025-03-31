// Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">Recipe Project</h1>
        <div>
          <Link to="/login" className="mx-2 text-green-600">Login</Link>
          <Link to="/register" className="mx-2 text-green-600">Sign Up</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;