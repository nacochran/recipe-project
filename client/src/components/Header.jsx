import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Img } from '@/components/ui/Img';

const Header = ({ user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  // Refs for detecting outside clicks
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Close dropdown & mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // close dropdown when scenes switch
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="recipe-container py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-recipe-600 font-bold text-2xl">
            Recipe<span className="text-spice-500">Pal</span>
          </span>
        </Link>

        {/* Search Recipes - Centered */}
        <div className="hidden md:flex flex-grow justify-center">
          <Link
            to="/search"
            className="text-gray-700 hover:text-recipe-600 transition-colors text-lg font-semibold"
          >
            Search Recipes
          </Link>
        </div>

        {/* Right Side - Authentication / User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="p-2 rounded hover:bg-gray-100">
                Login
              </Link>
              <Link to="/signup" className="p-2 rounded hover:bg-gray-100">
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
              >
                <span className="text-gray-700">{user.username}</span>
                {!user.avatar_url && <User className="text-gray-500 w-8 h-8" />}
                {user.avatar_url && <Img src={user.avatar_url} alt="User Avatar" className="w-8 h-8 rounded-full border" />}

              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-50">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/profile/settings" className="block px-4 py-2 hover:bg-gray-100">
                    Settings
                  </Link>
                  <Link to="/profile/recipes" className="block px-4 py-2 hover:bg-gray-100">
                    My Recipes
                  </Link>
                  <Link to="/profile/meal-planner" className="block px-4 py-2 hover:bg-gray-100">
                    Meal Planner
                  </Link>
                  <hr className="my-1" />
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Flyout Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          {/* Flyout panel */}
          <div ref={mobileMenuRef} className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Menu items */}
            <div className="mt-4 space-y-4">
              {!user ? (
                <>
                  <Link
                    to="/search"
                    className="block text-gray-700 hover:text-recipe-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Search Recipes
                  </Link>
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-recipe-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block text-gray-700 hover:text-recipe-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>

                  <div className="flex items-center space-x-2 p-2 rounded-full">
                    {!user.avatar_url && <User className="text-gray-500 w-8 h-8" />}
                    {user.avatar_url && <Img src={user.avatar_url} alt="User Avatar" className="w-8 h-8 rounded-full border" />}

                    <span className="text-gray-700">{user.username}</span>
                  </div>
                  <hr className="border-gray-300" />
                  <Link
                    to="/search"
                    className="block text-gray-700 hover:text-recipe-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Search Recipes
                  </Link>
                  <hr className="border-gray-300" />
                  <Link
                    to="/profile"
                    className="block text-gray-700 hover:text-recipe-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/profile/settings"
                    className="block text-gray-700 hover:text-recipe-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/profile/recipes"
                    className="block text-gray-700 hover:text-recipe-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Recipes
                  </Link>
                  <Link
                    to="/profile/meal-planner"
                    className="block text-gray-700 hover:text-recipe-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Meal Planner
                  </Link>
                  <hr className="border-gray-300" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-700 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
