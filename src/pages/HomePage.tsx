import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlatformSelector } from '../components/PlatformSelector';
import { UsernameInput } from '../components/UsernameInput';
import { CheckButton } from '../components/CheckButton';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { ResultCard } from '../components/ResultCard';
import { Platform, DetectionResult } from '../types';
import { FakeDetector } from '../services/fakeDetector';

interface HomePageProps {
  onAddResult: (result: DetectionResult) => void;
}

export function HomePage({ onAddResult }: HomePageProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<DetectionResult | null>(null);
  const navigate = useNavigate();

  const handleCheck = async () => {
    if (!selectedPlatform || !username.trim()) return;

    setIsLoading(true);
    setCurrentResult(null);

    try {
      const result = await FakeDetector.checkAccount(selectedPlatform, username.trim());
      setCurrentResult(result);
      onAddResult(result);
    } catch (error) {
      console.error('Detection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canCheck = selectedPlatform && username.trim() && !isLoading;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-pulse">
              FAKE DETECTOR
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Advanced AI-powered detection system for identifying fake social media accounts
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-100"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-200"></div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700 rounded-lg p-8 mb-8">
              <PlatformSelector
                selectedPlatform={selectedPlatform}
                onSelectPlatform={setSelectedPlatform}
              />
              
              <UsernameInput
                username={username}
                onUsernameChange={setUsername}
                onSubmit={handleCheck}
                disabled={isLoading}
              />
              
              <CheckButton
                onClick={handleCheck}
                disabled={!canCheck}
              />
            </div>

            {currentResult && (
              <ResultCard result={currentResult} />
            )}

            <div className="text-center">
              <button
                onClick={() => navigate('/results')}
                className="
                  text-blue-400 hover:text-blue-300 underline transition-colors duration-200
                  flex items-center space-x-2 mx-auto
                "
              >
                <span>View Full Detection Log & Analytics</span>
                <span className="text-xs">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading && <LoadingAnimation />}
    </>
  );
}