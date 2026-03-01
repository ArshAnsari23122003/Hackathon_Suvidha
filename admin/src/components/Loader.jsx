import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-6">
      <div className="relative w-20 h-20">
        {/* Outer spinning gradient ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-t-4 border-l-4 border-purple-600 border-r-4 border-r-transparent border-b-4 border-b-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner pulsing core */}
        <motion.div
          className="absolute inset-4 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full shadow-lg shadow-purple-200"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7] 
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="text-center">
        <h3 className="text-purple-900 font-bold tracking-widest text-sm uppercase">
          Verifying Session
        </h3>
        <p className="text-purple-400 text-xs mt-1 font-medium">Please wait a moment...</p>
      </div>
    </div>
  );
};

export default Loader;