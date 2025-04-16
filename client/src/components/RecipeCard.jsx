import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import { Img } from "./ui/Img.jsx";


const RecipeCard = ({ recipe }) => {

  return (
    <Link to={`../${recipe.author}/recipes/${recipe.slug}`} className="recipe-card block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 w-full">
          <Img
            src={recipe.image_url}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
              {recipe.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-recipe-500 text-white text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            {/* Rating on the left */}
            <div className="flex items-center text-spice-400">
              {recipe.average_rating > 0 && (<div><Star className="w-4 h-4 fill-current" />
                <span className="ml-1 text-sm font-medium">{recipe.average_rating}</span></div>)}
              {recipe.average_rating == 0 && (<div><Star className="w-4 h-4 fill-stone-300 stroke-stone-300" /></div>)}
            </div>

            {/* Difficulty on the right */}
            <span className="text-xs text-gray-500">{recipe.difficulty}</span>
          </div>

          <h3 className="text-lg font-semibold mb-2 text-gray-800">{recipe.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{recipe.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="ml-1 text-sm">{recipe.prep_time + recipe.cook_time} mins</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">by {recipe.author}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
