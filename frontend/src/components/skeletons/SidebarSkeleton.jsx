import React from 'react';

const SidebarSkeleton = () => {
  return (
    <div className="w-full h-screen bg-gray-100 p-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-6 bg-gray-300 rounded mb-6 w-3/4"></div>

      {/* Item Skeletons */}
      {[...Array(6)].map((_, idx) => (
        <div
          key={idx}
          className="h-4 bg-gray-300 rounded mb-4 w-full"
        ></div>
      ))}

      {/* Profile or Footer Skeleton */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;
