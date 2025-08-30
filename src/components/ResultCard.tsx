import React from 'react';
import { Shield, ShieldAlert, ShieldX, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { DetectionResult } from '../types';

interface ResultCardProps {
  result: DetectionResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const getStatusIcon = () => {
    switch (result.status) {
      case 'genuine': return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'suspicious': return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
      case 'fake': return <XCircle className="w-8 h-8 text-red-400" />;
      default: return <Shield className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case 'genuine': return 'border-green-500 bg-green-500/10';
      case 'suspicious': return 'border-yellow-500 bg-yellow-500/10';
      case 'fake': return 'border-red-500 bg-red-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getRiskBarColor = () => {
    if (result.riskPercentage < 30) return 'bg-green-400';
    if (result.riskPercentage < 70) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  if (!result.exists) {
    return (
      <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 mb-6">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Account Not Found</h3>
          <p className="text-gray-400">
            The username @{result.username} does not exist on {result.platform.name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-2 rounded-lg p-6 mb-6 ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-xl font-bold text-white">
              @{result.username}
            </h3>
            <p className="text-gray-400">{result.platform.name}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{result.riskPercentage}%</div>
          <div className="text-sm text-gray-400">Risk Score</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Risk Level</span>
          <span className="capitalize text-white">{result.status}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${getRiskBarColor()}`}
            style={{ width: `${result.riskPercentage}%` }}
          ></div>
        </div>
      </div>

      {result.isVerified && (
        <div className="flex items-center space-x-2 mb-4 text-blue-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Verified Account</span>
        </div>
      )}

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Analysis</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{result.explanation}</p>
      </div>

      {result.indicators.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Risk Indicators</h4>
          <div className="space-y-2">
            {result.indicators.map((indicator, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-red-400">
                <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                <span>{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}