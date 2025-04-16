import React, { useState, useEffect } from 'react';
import SearchFilters from '../components/SearchFilters';
import RecipeGrid from '../components/RecipeGrid';

const Search = () => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    cuisine: 'all',
    mealType: 'all',
    dietary: 'all',
    difficulty: 'all',
    maxTime: ''
  });
  const [sortType, setSortType] = useState('default');

  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRecipes = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();

      if (filters.searchTerm) params.append('title', filters.searchTerm);
      if (filters.maxTime) params.append('cookTime', filters.maxTime);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (sortType && sortType !== 'default') {
        params.append('sort', sortType);
      }

      const tagList = [filters.cuisine, filters.mealType, filters.dietary]
        .filter(tag => tag && tag !== 'all')
        .map(tag => `${tag}`)
        .join(',');
      if (tagList) params.append('tags', tagList);

      const response = await fetch(`http://localhost:5000/recipes?${params.toString()}`);
      const json = await response.json();

      console.log("JSON: ", json.data);

      if (json.error) {
        setFilteredRecipes([]);
        setError(json.error);
      } else {
        setFilteredRecipes(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };



  // Fetch recipes when filters change
  useEffect(() => {
    fetchRecipes();
  }, [filters, sortType]);

  return (
    <div className="recipe-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Find Recipes</h1>
        <SearchFilters filters={filters} setFilters={setFilters} />
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {loading
            ? 'Loading...'
            : `${filteredRecipes.length} ${filteredRecipes.length === 1 ? 'Recipe' : 'Recipes'} Found`}
        </h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Sort by:</span>
          <select
            className="border-gray-300 rounded-md text-sm"
            defaultValue="default"
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="rating">Highest Rating</option>
            <option value="time">Shortest Time</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <RecipeGrid
        recipes={filteredRecipes}
        emptyMessage="No recipes match your criteria. Try adjusting your filters."
      />
    </div>
  );
};

export default Search;
