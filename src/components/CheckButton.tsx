import React from 'react';
import { Shield } from 'lucide-react';

interface CheckButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function CheckButton({ onClick, disabled }: CheckButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        w-full py-4 px-8 rounded-lg font-bold text-white
        bg-gradient-to-r from-pink-500 to-purple-600
        hover:from-pink-600 hover:to-purple-700
        disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
        transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25
        border-2 border-pink-500 hover:border-pink-400
        flex items-center justify-center space-x-2
      "
    >
      <Shield className="w-5 h-5" />
      <span>INITIATE SCAN</span>
    </button>
  );
}