import React from 'react';
import { Download, Shield, ShieldAlert, ShieldX } from 'lucide-react';
import { DetectionResult } from '../types';
import { exportToCSV } from '../utils/export';

interface LogTableProps {
  results: DetectionResult[];
}

export function LogTable({ results }: LogTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'genuine': return <Shield className="w-4 h-4 text-green-400" />;
      case 'suspicious': return <ShieldAlert className="w-4 h-4 text-yellow-400" />;
      case 'fake': return <ShieldX className="w-4 h-4 text-red-400" />;
      default: return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleExport = () => {
    exportToCSV(results);
  };

  if (results.length === 0) {
    return (
      <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-8 text-center">
        <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No scans performed yet. Start by checking an account!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border-2 border-purple-500 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-gray-700">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
          <span>Detection Log ({results.length} scans)</span>
        </h3>
        <button
          onClick={handleExport}
          className="
            flex items-center space-x-2 px-4 py-2 rounded-lg 
            bg-purple-600 hover:bg-purple-700 text-white
            transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25
          "
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Risk %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {results.slice().reverse().map((result) => (
              <tr key={result.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {result.timestamp.toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  <div className="flex items-center space-x-2">
                    <span style={{ color: result.platform.color }}>{result.platform.icon}</span>
                    <span>{result.platform.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  @{result.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(result.status)}
                    <span className="capitalize text-white">{result.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-medium">{result.riskPercentage}%</span>
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          result.riskPercentage < 30 ? 'bg-green-400' :
                          result.riskPercentage < 70 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${result.riskPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}