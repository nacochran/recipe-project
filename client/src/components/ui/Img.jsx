import React from "react";

const BACKEND_URL = "http://localhost:5000";

const Img = ({ src, alt, className = "" }) => {
  if (!src) {
    return <span className="text-gray-500">No image available</span>;
  }

  const isBlobOrDataUrl = src.startsWith("blob:") || src.startsWith("data:");

  const imageUrl = isBlobOrDataUrl ? src : `${BACKEND_URL}/uploads/${src}`;

  return <img src={imageUrl} alt={alt || "Image"} className={`rounded-lg ${className}`} />;
};

export { Img };