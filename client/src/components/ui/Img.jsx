import React, { useState } from "react";
import { Skeleton } from "./skeleton";

const BACKEND_URL = "http://localhost:5000";

const Img = ({ src, alt, className = "" }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!src) {
    return <span className="text-gray-500">No image available</span>;
  }

  const isBlobOrDataUrl = src.startsWith("blob:") || src.startsWith("data:");

  const imageUrl = isBlobOrDataUrl ? src : `${BACKEND_URL}/uploads/${src}`;

  return (<>
    {isLoading && (
      <div className="relative">
        <Skeleton className={`absolute inset-0 ${className}`} />
      </div>
    )}
    <img
      src={imageUrl}
      alt={alt || "Image"}
      className={`rounded-lg ${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      onLoad={() => setIsLoading(false)}
    />
  </>
  );
};

export { Img };