import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingComponent = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-recipe-500 animate-spin mb-4" />
        <h3 className="text-xl font-medium text-recipe-600 mt-2">Loading RecipePal</h3>
        <p className="text-gray-500 mt-2">Preparing your delicious experience...</p>

        {/* Animated progress bar */}
        <div className="w-full mt-6 bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div className="bg-recipe-500 h-1.5 rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingComponent;