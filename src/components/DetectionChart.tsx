import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DetectionResult, ChartDataPoint } from '../types';
import { format, subHours } from 'date-fns';

interface DetectionChartProps {
  results: DetectionResult[];
}

export function DetectionChart({ results }: DetectionChartProps) {
  const generateChartData = (): ChartDataPoint[] => {
    const now = new Date();
    const data: ChartDataPoint[] = [];
    
    // Generate last 12 hours of data
    for (let i = 11; i >= 0; i--) {
      const hour = subHours(now, i);
      const hourStr = format(hour, 'HH:mm');
      
      // Count results in this hour
      const hourResults = results.filter(result => {
        const resultHour = new Date(result.timestamp);
        return resultHour.getHours() === hour.getHours() && 
               resultHour.getDate() === hour.getDate();
      });
      
      const fakeCount = hourResults.filter(r => r.status === 'fake').length;
      const suspiciousCount = hourResults.filter(r => r.status === 'suspicious').length;
      
      data.push({
        hour: hourStr,
        fakeCount,
        suspiciousCount
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-pink-500 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey === 'fakeCount' ? 'Fake' : 'Suspicious'}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        <span>Detection Trends (Last 12 Hours)</span>
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="hour" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="fakeCount" 
              stroke="#EF4444" 
              strokeWidth={3}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
              name="Fake Accounts"
            />
            <Line 
              type="monotone" 
              dataKey="suspiciousCount" 
              stroke="#F59E0B" 
              strokeWidth={3}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
              name="Suspicious Accounts"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}