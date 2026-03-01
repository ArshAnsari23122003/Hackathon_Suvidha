import React from "react";

const Loader = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
      
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute w-16 h-16 border-4 border-indigo-300 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
      </div>

      {/* Text */}
      <p className="mt-6 text-white text-lg animate-pulse">
        Loading your portal...
      </p>
    </div>
  );
};

export default Loader;