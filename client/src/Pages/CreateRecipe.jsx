import React from 'react';
import RecipeForm from '../components/RecipeForm';

const CreateRecipe = ({ user }) => {
  // const existingRecipe = {
  //   title: recipe.title,
  //   image_url: recipe.image_url,
  //   difficulty: recipe.difficulty,
  //   prep_time: recipe.prep_time,
  //   cook_time: recipe.cook_time,
  //   servings: recipe.servings,
  //   cal_count: recipe.cal_count,
  //   tags: [FOR EACH TAG where tag.recipe_id = recipe.id],
  //   ingredients: [],
  //   instructions: []
  // };

  return (
    <div className="recipe-container">
      <RecipeForm user={user} />
    </div>
  );
};

export default CreateRecipe;