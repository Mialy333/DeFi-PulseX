import React from 'react';
import type { ChartData } from '../../../types/api';

interface ChartsProps {
  data?: ChartData[];
  isLoading?: boolean;
}

const Charts: React.FC<ChartsProps> = ({ data = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-800/50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-800/50 rounded-lg">
        <p className="text-slate-400">No chart data available</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Price Chart</h3>
      {/* TODO: Implement chart visualization */}
      <div className="h-64 flex items-center justify-center">
        <p className="text-slate-400">Chart visualization coming soon...</p>
      </div>
    </div>
  );
};

export default Charts;
