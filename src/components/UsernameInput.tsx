import React from 'react';
import { Search } from 'lucide-react';

interface UsernameInputProps {
  username: string;
  onUsernameChange: (username: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function UsernameInput({ username, onUsernameChange, onSubmit, disabled }: UsernameInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) {
      onSubmit();
    }
  };

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-300 mb-4">
        Enter Username
      </label>
      <div className="relative">
        <input
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          placeholder="e.g., @username"
          className="
            w-full px-6 py-4 pl-12 rounded-lg border-2 border-gray-700 
            bg-gray-900/50 text-white placeholder-gray-500 
            focus:border-pink-500 focus:outline-none focus:shadow-lg focus:shadow-pink-500/25
            transition-all duration-300 disabled:opacity-50
          "
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
      </div>
    </div>
  );
}