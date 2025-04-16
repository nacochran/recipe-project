import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Utensils, ChefHat } from 'lucide-react';
import RecipeGrid from '../components/RecipeGrid';

const Home = () => {
  // Get featured recipes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [featuredRecipesList, setFeaturedRecipesList] = useState([]);

  const fetchRecipes = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/recipes?sort=newest&limit=3`);
      const json = await response.json();

      if (json.error) {
        setError(json.error);
      } else {
        setFeaturedRecipesList(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-recipe-500 to-recipe-600 text-white py-16 md:py-24">
        <div className="recipe-container relative z-10">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Discover & Share<br />Delicious Recipes
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Find thousands of recipes, create your own collection, and plan your meals all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/search"
                className="bg-white text-recipe-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                <Search className="mr-2 h-5 w-5" />
                Find Recipes
              </Link>
              <Link
                to="/signup"
                className="bg-spice-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-spice-500 transition-colors inline-flex items-center justify-center"
              >
                <ChefHat className="mr-2 h-5 w-5" />
                Create an Account
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 pointer-events-none"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="recipe-container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Everything You Need for Meal Success</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-recipe-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-recipe-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Recipes</h3>
              <p className="text-gray-600">
                Search thousands of recipes by ingredient, cuisine, dietary needs, and more.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-recipe-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <ChefHat className="h-8 w-8 text-recipe-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create & Share</h3>
              <p className="text-gray-600">
                Add your own recipes, modify existing ones, and share your creations with the community.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-recipe-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-recipe-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Plan Your Meals</h3>
              <p className="text-gray-600">
                Organize your week with our meal planner and never wonder "what's for dinner?" again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-16">
        <div className="recipe-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Recipes</h2>
            <Link
              to="/search"
              className="text-recipe-600 hover:text-recipe-700 font-medium flex items-center"
            >
              View all
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          <RecipeGrid recipes={featuredRecipesList} />
        </div>
      </section>

      {/* Call to Aciton */}
      <section className="py-16 bg-spice-200">
        <div className="recipe-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Cooking?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-700">
            Join thousands of home cooks who are already discovering, creating, and sharing delicious recipes.
          </p>
          <Link
            to="/search"
            className="bg-spice-400 text-white px-8 py-3 rounded-lg font-medium hover:bg-spice-500 transition-colors inline-flex items-center justify-center"
          >
            <Utensils className="mr-2 h-5 w-5" />
            Explore Recipes
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
