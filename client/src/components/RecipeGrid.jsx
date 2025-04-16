
import React from 'react';
import RecipeCard from './RecipeCard';

const RecipeGrid = ({ recipes, emptyMessage = "No recipes found." }) => {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeGrid;
