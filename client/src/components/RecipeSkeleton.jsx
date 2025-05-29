import React from 'react';
import { Skeleton } from './ui/skeleton';

const RecipeSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="w-full h-48" />

      <div className="p-4">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 mb-3" />

        {/* Description skeleton */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />

        {/* Tags skeleton */}
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

export default RecipeSkeleton; 