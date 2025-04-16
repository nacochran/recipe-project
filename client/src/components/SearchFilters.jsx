
import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { cuisineTypes, mealTypes, dietaryOptions, difficultyLevels } from '../data/recipes';

const SearchFilters = ({ filters, setFilters }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* Search Input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search recipes..."
          className="pl-10 w-full py-2 border-gray-300 rounded-md shadow-sm focus:ring-recipe-500 focus:border-recipe-500"
          value={filters.searchTerm || ''}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        />
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Cuisine Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cuisine
          </label>
          <div className="relative">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-recipe-500 focus:border-recipe-500 rounded-md"
              value={filters.cuisine || 'all'}
              onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
            >
              <option value="all">All Cuisines</option>
              {cuisineTypes.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Meal Type Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meal Type
          </label>
          <div className="relative">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-recipe-500 focus:border-recipe-500 rounded-md"
              value={filters.mealType || 'all'}
              onChange={(e) => setFilters({ ...filters, mealType: e.target.value })}
            >
              <option value="all">All Meal Types</option>
              {mealTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Dietary Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dietary Preferences
          </label>
          <div className="relative">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-recipe-500 focus:border-recipe-500 rounded-md"
              value={filters.dietary || 'all'}
              onChange={(e) => setFilters({ ...filters, dietary: e.target.value })}
            >
              <option value="all">All Diets</option>
              {dietaryOptions.map(diet => (
                <option key={diet} value={diet}>{diet.charAt(0).toUpperCase() + diet.slice(1)}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level
          </label>
          <div className="relative">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-recipe-500 focus:border-recipe-500 rounded-md"
              value={filters.difficulty || 'all'}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            >
              <option value="all">All Levels</option>
              {difficultyLevels.map(level => (
                <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Time Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Time (minutes)
          </label>
          <input
            type="number"
            min="5"
            max="180"
            step="5"
            placeholder="Any time"
            className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-recipe-500 focus:border-recipe-500 rounded-md"
            value={filters.maxTime || ''}
            onChange={(e) => setFilters({ ...filters, maxTime: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
