import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, ChefHat, Bookmark } from 'lucide-react';
import RecipeGrid from '../components/RecipeGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const ProfileRecipes = ({ user }) => {
  // const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recipes, setRecipes] = useState('');

  const fetchRecipes = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/recipes?user=${user.username}`);
      const json = await response.json();

      if (json.error) {
        setRecipes([]);
        setError(json.error);
      } else {
        setRecipes(json.data || []);
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
    <div className="recipe-container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">My Recipes</h1>
        <Link
          to="/profile/recipes/create"
          className="recipe-button-primary flex items-center"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create Recipe
        </Link>
      </div>

      {/* Search and filter */}
      {/* <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search your recipes..."
            className="pl-10 w-full py-2 border-gray-300 rounded-md shadow-sm focus:ring-recipe-500 focus:border-recipe-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div> */}

      {/* 
       * Tabs 
       * TODO: In the future we might have various tabs; e.g.: all recipes, drafts, etc.
      */}
      <Tabs defaultValue="all">
        {/* All Recipes Tab */}
        <TabsContent value="all">
          {recipes.length > 0 ? (
            <RecipeGrid
              recipes={recipes}
              emptyMessage="No recipes match your search."
            />
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-800 mb-2">You haven't created any recipes yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first recipe</p>
              <Link
                to="/profile/recipes/create"
                className="recipe-button-primary flex items-center mx-auto w-fit"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Recipe
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileRecipes;