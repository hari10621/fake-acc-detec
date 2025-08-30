import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { DetectionChart } from '../components/DetectionChart';
import { LogTable } from '../components/LogTable';
import { DetectionResult } from '../types';

interface ResultsPageProps {
  results: DetectionResult[];
}

export function ResultsPage({ results }: ResultsPageProps) {
  const navigate = useNavigate();

  const stats = {
    total: results.length,
    fake: results.filter(r => r.status === 'fake').length,
    suspicious: results.filter(r => r.status === 'suspicious').length,
    genuine: results.filter(r => r.status === 'genuine').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="
              flex items-center space-x-2 text-blue-400 hover:text-blue-300 
              transition-colors duration-200
            "
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Scanner</span>
          </button>
          
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            DETECTION ANALYTICS
          </h1>
          
          <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-gray-400">Total Scans</div>
          </div>
          <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.fake}</div>
            <div className="text-sm text-gray-400">Fake Detected</div>
          </div>
          <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.suspicious}</div>
            <div className="text-sm text-gray-400">Suspicious</div>
          </div>
          <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.genuine}</div>
            <div className="text-sm text-gray-400">Genuine</div>
          </div>
        </div>

        <DetectionChart results={results} />
        <LogTable results={results} />
      </div>
    </div>
  );
}