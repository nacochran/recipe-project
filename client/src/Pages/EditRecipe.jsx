import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';

const EditRecipe = ({ user }) => {
  const { recipe_slug } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`http://localhost:5000/${user.username}/recipes/${recipe_slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const json = await response.json();

        console.log(json.data);

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
  }, [user.username, recipe_slug]);

  if (loading) {
    return <div className="text-center py-8">Loading recipe...</div>;
  }

  if (!recipe) {
    return <div className="text-center py-8">Recipe not found</div>;
  }

  return (
    <div className="recipe-container">
      <RecipeForm existingRecipe={recipe} user={user} />
    </div>
  );
};

export default EditRecipe;