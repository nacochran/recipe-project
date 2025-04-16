
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { recipes } from '../data/recipes';

const MealPlanner = () => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const mealTimes = ['Breakfast', 'Lunch', 'Dinner'];
  
  // Get current date and week
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeekDates(currentDate));
  
  // Function to get dates for a week given a date within that week
  function getWeekDates(date) {
    const day = date.getDay(); // 0 is Sunday, 6 is Saturday
    const diff = date.getDate() - day;
    const weekStart = new Date(date);
    weekStart.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(weekStart);
      newDate.setDate(weekStart.getDate() + i);
      weekDates.push(newDate);
    }
    return weekDates;
  }
  
  // Mock data - in real app this would come from the backend
  const [mealPlan, setMealPlan] = useState({
    // Sample meal plan data (just for Monday and Wednesday)
    "2023-04-10": {
      "Breakfast": recipes[1], // Avocado Toast
      "Lunch": null,
      "Dinner": recipes[2], // Thai Basil Chicken
    },
    "2023-04-12": {
      "Breakfast": null,
      "Lunch": recipes[4], // Vegan Buddha Bowl
      "Dinner": recipes[0], // Creamy Garlic Pasta
    }
  });
  
  // Navigation functions
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
    setCurrentWeek(getWeekDates(newDate));
  };
  
  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
    setCurrentWeek(getWeekDates(newDate));
  };
  
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setCurrentWeek(getWeekDates(today));
  };
  
  // Format date as "YYYY-MM-DD" for lookup in mealPlan
  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Get a meal for a specific date and meal time
  const getMeal = (date, mealTime) => {
    const dateKey = formatDateKey(date);
    if (mealPlan[dateKey] && mealPlan[dateKey][mealTime]) {
      return mealPlan[dateKey][mealTime];
    }
    return null;
  };
  
  // Helper to check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  return (
    <div className="recipe-container py-8">
      <h1 className="text-3xl font-bold mb-8">Meal Planner</h1>
      
      {/* Calendar Navigation */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <button 
            onClick={goToPreviousWeek}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <button 
            onClick={goToToday}
            className="mx-2 px-4 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-100"
          >
            Today
          </button>
          
          <button 
            onClick={goToNextWeek}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Next week"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
          
          <span className="ml-4 text-lg font-medium">
            {`${currentWeek[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${currentWeek[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 flex items-center text-sm"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Month
          </button>
          <button 
            className="p-2 rounded-md bg-recipe-500 text-white hover:bg-recipe-600 flex items-center text-sm"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Week
          </button>
        </div>
      </div>
      
      {/* Meal Planner Grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-3 bg-gray-50 border-r"></div>
          {currentWeek.map((date, index) => (
            <div 
              key={index} 
              className={`p-3 text-center font-medium ${isToday(date) ? 'bg-recipe-50' : 'bg-gray-50'} border-r last:border-r-0`}
            >
              <div className="text-xs text-gray-500">{daysOfWeek[index]}</div>
              <div className={`text-sm mt-1 ${isToday(date) ? 'text-recipe-600' : 'text-gray-800'}`}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>
        
        {/* Meal Rows */}
        {mealTimes.map(mealTime => (
          <div key={mealTime} className="grid grid-cols-8 border-b last:border-b-0">
            {/* Meal Time Label */}
            <div className="p-3 font-medium text-gray-700 bg-gray-50 border-r">
              {mealTime}
            </div>
            
            {/* Days of the Week */}
            {currentWeek.map((date, dayIndex) => {
              const meal = getMeal(date, mealTime);
              
              return (
                <div 
                  key={dayIndex} 
                  className={`p-2 border-r last:border-r-0 ${isToday(date) ? 'bg-recipe-50/30' : ''}`}
                >
                  {meal ? (
                    // Show meal card if a meal is planned
                    <Link to={`/recipe/${meal.id}`} className="block">
                      <div className="bg-white border rounded-md p-2 hover:border-recipe-500 transition-colors">
                        <div className="aspect-w-16 aspect-h-9 mb-2">
                          <img 
                            src={meal.image} 
                            alt={meal.title} 
                            className="w-full h-16 object-cover rounded"
                          />
                        </div>
                        <h4 className="text-sm font-medium line-clamp-1">{meal.title}</h4>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500">{meal.time} min</span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    // Show add placeholder if no meal
                    <div className="flex items-center justify-center h-full min-h-[100px]">
                      <button className="text-gray-400 hover:text-recipe-500 flex flex-col items-center">
                        <PlusCircle className="h-6 w-6" />
                        <span className="text-xs mt-1">Add Meal</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Shopping List Preview */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Weekly Shopping List</h2>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-gray-600 mb-4">Based on your meal plan, here's your shopping list:</p>
          
          {/* Sample shopping list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium mb-2">Produce</h3>
              <ul className="space-y-1">
                <li className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" />
                  <span>2 avocados</span>
                </li>
                <li className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" />
                  <span>1 cup broccoli</span>
                </li>
                <li className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" />
                  <span>1 sweet potato</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Protein</h3>
              <ul className="space-y-1">
                <li className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" />
                  <span>1 lb ground chicken</span>
                </li>
                <li className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" />
                  <span>1 cup chickpeas</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Dairy & Eggs</h3>
              <ul className="space-y-1">
                <li className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" />
                  <span>4 eggs</span>
                </li>
                <li className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" />
                  <span>1 cup heavy cream</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button className="recipe-button-secondary">
              View Full Shopping List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
