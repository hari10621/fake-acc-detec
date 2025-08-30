import React from 'react';
import { Platform } from '../types';
import { platforms } from '../data/platforms';

interface PlatformSelectorProps {
  selectedPlatform: Platform | null;
  onSelectPlatform: (platform: Platform) => void;
}

export function PlatformSelector({ selectedPlatform, onSelectPlatform }: PlatformSelectorProps) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-300 mb-4">
        Select Platform
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => onSelectPlatform(platform)}
            className={`
              relative overflow-hidden rounded-lg border-2 p-6 transition-all duration-300 transform hover:scale-105
              ${selectedPlatform?.id === platform.id
                ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/25'
                : 'border-gray-700 bg-gray-800/50 hover:border-blue-500 hover:bg-blue-500/10'
              }
            `}
          >
            <div className="text-center">
              <div className="text-3xl mb-2" style={{ color: platform.color }}>
                {platform.icon}
              </div>
              <div className="text-white font-medium">{platform.name}</div>
            </div>
            {selectedPlatform?.id === platform.id && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}