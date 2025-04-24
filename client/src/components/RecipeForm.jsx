import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Clock, Plus, Trash2, ArrowUp, ArrowDown, Upload, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Img } from "@/components/ui/Img";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const RecipeForm = ({ existingRecipe = null, user }) => {
  const navigate = useNavigate();
  const isEditing = !!existingRecipe;

  console.log("Testing existing recipe: ", existingRecipe.instructions);

  // Form state
  const [title, setTitle] = useState(existingRecipe?.title || '');
  const [description, setDescription] = useState(existingRecipe?.description || '');
  const [imageFile, setImageFile] = useState(null);
  const [image, setImage] = useState(existingRecipe?.image || '');
  const [availableTags, setAvailableTags] = useState([]);
  const [tagSearch, setTagSearch] = useState('');
  const [calories, setCalories] = useState(0);
  const [tags, setTags] = useState(existingRecipe?.tags || []);
  const [prepTime, setPrepTime] = useState(existingRecipe?.prepTime || 0);
  const [cookTime, setCookTime] = useState(existingRecipe?.cookTime || 0);
  const [difficulty, setDifficulty] = useState(existingRecipe?.difficulty || 'medium');
  const [servings, setServings] = useState(existingRecipe?.servings || 2);
  const [ingredients, setIngredients] = useState(existingRecipe?.ingredients || [
    { id: 1, quantity: '', name: '' }
  ]);
  const [instructions, setInstructions] = useState(existingRecipe?.instructions || [
    { id: 1, text: '' }
  ]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch('http://localhost:5000/get-tags');
        const data = await res.json();
        setAvailableTags(data); // Assume each tag is a string. Adjust if it's an object.
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };

    fetchTags();

    // set image
    if (existingRecipe != null) {
      setImage(existingRecipe.image_url);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
      setImageFile(file);
    }
  };


  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Ingredient handlers
  const addIngredient = () => {
    const newId = ingredients.length > 0 ? Math.max(...ingredients.map(i => i.id)) + 1 : 1;
    setIngredients([...ingredients, { id: newId, quantity: '', name: '' }]);
  };

  const updateIngredient = (id, field, value) => {
    setIngredients(ingredients.map(ingredient =>
      ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
    ));
  };

  const removeIngredient = (id) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
    }
  };

  const moveIngredient = (id, direction) => {
    const index = ingredients.findIndex(item => item.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === ingredients.length - 1)) {
      return;
    }

    const newIngredients = [...ingredients];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    [newIngredients[index], newIngredients[targetIndex]] = [newIngredients[targetIndex], newIngredients[index]];
    setIngredients(newIngredients);
  };

  // Instruction handlers
  const addInstruction = () => {
    const newId = instructions.length > 0 ? Math.max(...instructions.map(i => i.id)) + 1 : 1;
    setInstructions([...instructions, { id: newId, text: '' }]);
  };

  const updateInstruction = (id, text) => {
    setInstructions(instructions.map(instruction =>
      instruction.id === id ? { ...instruction, text } : instruction
    ));
  };

  const removeInstruction = (id) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter(instruction => instruction.id !== id));
    }
  };

  const moveInstruction = (id, direction) => {
    const index = instructions.findIndex(item => item.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === instructions.length - 1)) {
      return;
    }

    const newInstructions = [...instructions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    [newInstructions[index], newInstructions[targetIndex]] = [newInstructions[targetIndex], newInstructions[index]];
    setInstructions(newInstructions);
  };



  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedImageUrl = null;

    if (!imageFile && !existingRecipe && !existingRecipe.image_url) {
      alert("Please upload an image before submitting.");
      return;
    } else if (!existingRecipe.image_url) {
      // Upload image
      const formData = new FormData();
      formData.append('image', imageFile);

      try {
        const res = await fetch('http://localhost:5000/upload-image', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        uploadedImageUrl = data.imageUrl;
      } catch (err) {
        console.error('Upload error:', err);
        return;
      }
    }

    console.log(user);

    // Build the recipe object with the image URL
    const recipe = {
      id: existingRecipe?.id,
      title,
      imageUrl: existingRecipe.image_url || uploadedImageUrl,
      description: description,
      tags,
      calories,
      prepTime: parseInt(prepTime, 10) || 0,
      cookTime: parseInt(cookTime, 10) || 0,
      totalTime: (parseInt(prepTime, 10) || 0) + (parseInt(cookTime, 10) || 0),
      difficulty,
      servings: parseInt(servings, 10) || 2,
      ingredients: ingredients.filter(ingredient => ingredient.ingredient_name !== ''),
      instructions: instructions.filter(instruction => instruction.instruction_text !== ''),
      authorUsername: user.username,
      createdAt: existingRecipe?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log("Testing recipe: ", recipe);

    // Then POST recipe
    try {
      const route = (existingRecipe) ? 'edit-recipe' : 'create-recipe';
      const response = await fetch(`http://localhost:5000/${route}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipe)
      });

      const result = await response.json();
      if (result.error) {
        alert('Error: ' + result.error);
      } else {
        navigate('/profile/recipes');
      }
    } catch (err) {
      console.error('Error saving recipe: ', err);
    }
  };


  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-recipe-600">
        {isEditing ? 'Edit Recipe' : 'Create New Recipe'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Recipe Name */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-lg">Recipe Name</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter recipe name"
            className="text-lg"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-lg">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe your recipe..."
            rows={4}
            maxLength={1000}
            className="resize-none"
            required
          />
        </div>

        {/* Recipe Image */}
        <div className="space-y-2">
          <Label className="text-lg">Recipe Image</Label>
          <div className="flex items-center space-x-4">
            <div
              className={cn(
                "relative w-32 h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50",
                image ? "border-recipe-500" : "border-gray-300"
              )}
              onClick={() => document.getElementById('recipe-image').click()}
            >
              {image ? (
                <Img
                  src={image}
                  alt="Recipe preview"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-1">Upload image</span>
                </>
              )}
              <input
                id="recipe-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            {image && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setImage('')}
                className="text-red-500"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label className="text-lg">Tags</Label>

          {/* Display selected tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <div
                key={tag}
                className="flex items-center bg-recipe-100 text-recipe-700 px-3 py-1 rounded-full"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-recipe-500 hover:text-recipe-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Search input for tags */}
          <Input
            type="text"
            placeholder="Search or select tag..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();

                const filteredTags = availableTags.filter(
                  tag =>
                    tag.toLowerCase().includes(tagSearch.toLowerCase()) &&
                    !tags.includes(tag)
                );

                if (filteredTags.length > 0) {
                  setTags([...tags, filteredTags[0]]);
                  setTagSearch('');
                }
              }
            }}
          />

          {/* Filtered dropdown */}
          <div className="border rounded-md mt-1 max-h-40 overflow-y-auto bg-white z-10 shadow-sm">
            {availableTags
              .filter(tag =>
                tag.toLowerCase().includes(tagSearch.toLowerCase()) && !tags.includes(tag) && tagSearch != ''
              )
              .map((tag, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setTags([...tags, tag]);
                    setTagSearch('');
                  }}
                  className="px-3 py-2 hover:bg-recipe-100 cursor-pointer"
                >
                  {tag}
                </div>
              ))}
          </div>
        </div>

        {/* Recipe Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prep Time */}
          <div className="space-y-2">
            <Label htmlFor="prepTime" className="text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2 text-recipe-500" />
              Prep Time (minutes)
            </Label>
            <Input
              id="prepTime"
              type="number"
              min="0"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              required
            />
          </div>

          {/* Cook Time */}
          <div className="space-y-2">
            <Label htmlFor="cookTime" className="text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2 text-spice-400" />
              Cook Time (minutes)
            </Label>
            <Input
              id="cookTime"
              type="number"
              min="0"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              required
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label htmlFor="difficulty" className="text-lg flex items-center">
              <ChefHat className="w-5 h-5 mr-2 text-recipe-500" />
              Difficulty
            </Label>
            <Select
              value={difficulty}
              onValueChange={setDifficulty}
            >
              <SelectTrigger id="difficulty" className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Servings */}
          <div className="space-y-2">
            <Label htmlFor="servings" className="text-lg">Serving Size</Label>
            <Input
              id="servings"
              type="number"
              min="1"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Calories */}
        <div className="space-y-2">
          <Label htmlFor="calories">Calories</Label>
          <Input
            id="calories"
            type="number"
            value={calories ?? ""}
            onChange={(e) => setCalories(e.target.value ? parseInt(e.target.value) : null)}
            placeholder="e.g. 450"
          />
        </div>

        {/* Ingredients */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-xl font-semibold">Ingredients</Label>
            <Button
              type="button"
              onClick={addIngredient}
              className="bg-recipe-500 text-white hover:bg-recipe-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Ingredient
            </Button>
          </div>
          <div className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <div
                key={ingredient.id}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex flex-col sm:flex-row flex-1 gap-2">
                  <Input
                    value={ingredient.quantity}
                    onChange={(e) => updateIngredient(ingredient.id, 'quantity', e.target.value)}
                    placeholder="Quantity"
                    className="flex-1"
                  />
                  <Input
                    value={ingredient.unit_type}
                    onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                    placeholder="Unit (e.g.: cups)"
                    className="flex-1"
                  />
                  <Input
                    value={ingredient.ingredient_name}
                    onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                    placeholder="Ingredient name"
                    className="flex-1"
                    required
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveIngredient(ingredient.id, 'up')}
                    className="text-gray-500 hover:text-recipe-500"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveIngredient(ingredient.id, 'down')}
                    className="text-gray-500 hover:text-recipe-500"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(ingredient.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-xl font-semibold">Instructions</Label>
            <Button
              type="button"
              onClick={addInstruction}
              className="bg-recipe-500 text-white hover:bg-recipe-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
          <div className="space-y-3">
            {instructions.map((instruction, index) => (
              <div
                key={instruction.id}
                className="flex gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <div className="bg-recipe-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-2">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <Textarea
                    value={instruction.instruction_text}
                    onChange={(e) => updateInstruction(instruction.id, e.target.value)}
                    placeholder={`Step ${index + 1} instructions`}
                    rows={2}
                    className="resize-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveInstruction(instruction.id, 'up')}
                    className="text-gray-500 hover:text-recipe-500"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveInstruction(instruction.id, 'down')}
                    className="text-gray-500 hover:text-recipe-500"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInstruction(instruction.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/profile/recipes')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-recipe-500 hover:bg-recipe-600 text-white"
          >
            {isEditing ? 'Update Recipe' : 'Create Recipe'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;