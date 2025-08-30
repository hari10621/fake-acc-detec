import React from 'react';

interface LoadingAnimationProps {
  message?: string;
}

export function LoadingAnimation({ message = 'Analyzing account...' }: LoadingAnimationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-transparent border-t-pink-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-blue-500 rounded-full animate-spin animation-delay-150"></div>
          <div className="absolute inset-4 border-4 border-transparent border-t-green-400 rounded-full animate-spin animation-delay-300"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse">
            {message}
          </p>
        </div>
        
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-100"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce animation-delay-200"></div>
        </div>
        
        <div className="mt-6 text-gray-400 text-sm">
          <div className="typing-effect">Scanning digital footprint...</div>
        </div>
      </div>
    </div>
  );
}