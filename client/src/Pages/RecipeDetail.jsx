
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, Star, ChefHat, Tag, Share2, Heart } from 'lucide-react';
import { Img } from "../components/ui/Img.jsx";
import { Button } from "../components/ui/button.jsx";
import { Pencil } from "lucide-react"

const RecipeDetail = ({ user }) => {
  const { username, recipe_slug } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [crossedOut, setCrossedOut] = useState(new Set());
  // TODO
  const [newServingCount, setNewServingCount] = useState(1);

  const toggleSelection = (ingredient) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(ingredient)) {
      newSelectedItems.delete(ingredient); // Remove if already selected
    } else {
      newSelectedItems.add(ingredient); // Add if not selected
    }
    setSelectedItems(newSelectedItems);
  };

  const toggleCrossedOut = (index) => {
    const newCrossedOut = new Set(crossedOut);
    if (newCrossedOut.has(index)) {
      newCrossedOut.delete(index); // Remove from crossed-out set if clicked again
    } else {
      newCrossedOut.add(index); // Add to crossed-out set
    }
    setCrossedOut(newCrossedOut);
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`http://localhost:5000/${username}/recipes/${recipe_slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const json = await response.json();

        setRecipe(json.data);
        // setNewServingCount(json.data.servings);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [username, recipe_slug]);


  if (loading) {
    return (
      <div className="recipe-container py-16 text-center">
        <p className="text-gray-500">Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="recipe-container py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Recipe Not Found</h1>
        <p className="text-gray-600 mb-8">The recipe you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/search"
          className="bg-recipe-500 text-white px-6 py-2 rounded-lg hover:bg-recipe-600 transition-colors"
        >
          Discover Recipes
        </Link>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: save this state to the user's profile
  };

  const handleShareRecipe = () => {
    // TODO: implement social sharing functionality
    alert('Sharing functionality would be implemented here!');
  };

  const handleServingCountChange = (e) => {
    setNewServingCount(e.target.value);
  };

  const handleSetServingCount = () => {
    alert('We will implement quantity adjustments here later!');
  };

  return (
    <div className="recipe-container py-8">
      {/* Recipe Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mt-2 mb-3 sm:mt-0">
          <div className="flex items-center space-x-2">
            <p className="flex items-center h-full">28 likes</p>
            <button
              onClick={handleToggleFavorite}
              className={`p-2 h-10 w-10 flex items-center justify-center rounded-full border ${isFavorite
                ? "bg-red-50 border-red-200 text-red-500"
                : "border-gray-200 text-gray-400 hover:text-red-500"
                }`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleShareRecipe}
              className="p-2 h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-recipe-600"
              title="Share recipe"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>


        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold">{recipe.title}</h1>
          {user?.username === username && (
            <Button asChild variant="ghost" size="icon" title="Edit Recipe">
              <Link to={`/profile/recipes/${recipe_slug}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700">{recipe.prep_time + recipe.cook_time} mins</span>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700">Serves {recipe.servings}</span>


          </div>
          <div className="flex items-center">
            <ChefHat className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700 capitalize">{recipe.difficulty}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-spice-400 fill-current mr-2" />
            <span className="text-gray-700">{recipe.average_rating} ({recipe.reviews.length} reviews)</span>
          </div>
        </div>

        {/* Author & Date */}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="mr-2">By {recipe.author_name}</span>
          <span>•</span>
          <span className="ml-2">
            {new Date(recipe.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Tag className="h-4 w-4 text-gray-400" />
          {recipe.tags.map(label => (
            <Link
              key={label}
              to={`/search?label=${label}`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recipe Image & Ingredients/Instructions Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Recipe Image */}
        <div className="lg:col-span-2 order-1 lg:order-none">
          <div className="rounded-lg overflow-hidden mb-8">
            <Img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="bg-recipe-100 text-recipe-600 w-8 h-8 rounded-full inline-flex items-center justify-center mr-2">
                <span>2</span>
              </span>
              Instructions
            </h2>
            <ol className="space-y-6">
              {recipe.instructions.map((instruction, index) => (
                <li
                  key={index}
                  className="flex cursor-pointer"
                  onClick={() => toggleCrossedOut(index)} // Toggle the crossed-out state on click
                >
                  <span
                    className={`bg-recipe-500 text-white w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 mr-3`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={`text-gray-700 ${crossedOut.has(index) ? 'line-through text-gray-400' : ''}`}
                  >
                    {instruction.instruction_text}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <div className="space-y-6">
              {recipe.reviews.map((review, index) => (
                <div key={index} className={index !== 0 ? "pt-4 border-t border-gray-200" : ""}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.user}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-spice-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>

            {/* Review Form (simplified for demo) */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Leave a Review</h3>
              <div className="flex items-center mb-4">
                <span className="mr-2">Rating:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <button key={i} className="text-gray-300 hover:text-spice-400">
                      <Star className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Write your review..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-recipe-500 focus:border-recipe-500"
                rows={3}
              ></textarea>
              <button className="mt-3 bg-recipe-500 text-white px-4 py-2 rounded-md hover:bg-recipe-600 transition-colors">
                Submit Review
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar with Ingredients */}
        <div className="order-0 lg:order-none">
          <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="bg-recipe-100 text-recipe-600 w-8 h-8 rounded-full inline-flex items-center justify-center mr-2">
                <span>1</span>
              </span>
              Ingredients
              <span className="ml-auto text-sm text-gray-500 font-normal">
                For {recipe.servings} servings
              </span>
              {/* <div className="ml-auto flex items-center mb-6">
                <label htmlFor="servingCount" className="mr-4 text-sm text-gray-700">
                  Adjust Servings:
                </label>
                <input
                  type="number"
                  id="servingCount"
                  className="w-24 text-sm p-2 border border-gray-300 rounded-md"
                  value={recipe.servings}
                  onChange={handleServingCountChange}
                  min=""
                />
                <button
                  onClick={handleSetServingCount}
                  className="ml-4 text-sm bg-recipe-500 text-white px-4 py-2 rounded-md hover:bg-recipe-600"
                >
                  Set
                </button>
              </div> */}
            </h2>
            <ul className="space-y-3 mb-6">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className={`flex items-center cursor-pointer ${selectedItems.has(ingredient.ingredient_name)
                    ? "bg-blue-100 border-blue-400"
                    : "border-gray-300"
                    } p-2 rounded-md hover:bg-blue-50`}
                  onClick={() => toggleSelection(ingredient.ingredient_name)}
                >
                  <div
                    className={`w-5 h-5 border rounded-md mr-3 flex-shrink-0 ${selectedItems.has(ingredient.ingredient_name)
                      ? "bg-blue-500"
                      : "bg-white"
                      }`}
                  ></div>
                  <span className="text-gray-700">{ingredient.ingredient_name}</span>
                </li>
              ))}
            </ul>

            <button className="w-full bg-recipe-500 text-white py-2 rounded-md hover:bg-recipe-600 transition-colors mb-3">
              Add to Shopping List
            </button>
            <button className="w-full bg-spice-400 text-white py-2 rounded-md hover:bg-spice-500 transition-colors">
              Add to Meal Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
