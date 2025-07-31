import React, { useState } from 'react';
import type { ChartData } from '../../../types/api';

interface ChartsProps {
  data?: ChartData[];
  isLoading?: boolean;
  type?: 'portfolio' | 'token';
  walletAddress?: string;
  timeframes?: string[];
}

const Charts: React.FC<ChartsProps> = ({ 
  data = [], 
  isLoading = false, 
  type = 'token',
  walletAddress,
  timeframes = ['1D']
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframes[0]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <p className="text-slate-400">No chart data available</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-200">
          {type === 'portfolio' ? 'Portfolio Performance' : 'Price Chart'}
        </h3>
        <div className="flex space-x-2">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 rounded text-sm ${
                selectedTimeframe === timeframe
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-slate-400">Chart visualization coming soon...</p>
      </div>
    </div>
  );
};

export default Charts;
