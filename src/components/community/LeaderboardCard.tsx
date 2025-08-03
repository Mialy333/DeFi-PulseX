import React from 'react';
import { Trophy, TrendingUp, CircleDollarSign, Star } from 'lucide-react';

interface Trader {
  address: string;
  totalValue: number;
  profit: number;
  successRate: number;
  xp: number;
  rank: number;
}

const LeaderboardCard: React.FC = () => {
  // Mock data - replace with real data from your backend
  const topTraders: Trader[] = [
    {
      address: '0x742d...8c8c',
      totalValue: 1250000,
      profit: 25.4,
      successRate: 92,
      xp: 15000,
      rank: 1
    },
    // Add more mock traders here...
  ];

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-slate-300';
      case 3: return 'text-amber-600';
      default: return 'text-slate-400';
    }
  };

  const getXPLevel = (xp: number) => {
    if (xp >= 10000) return 'Diamond';
    if (xp >= 5000) return 'Platinum';
    if (xp >= 1000) return 'Gold';
    return 'Silver';
  };

  return (
    <div className="bg-deep-purple-700/30 border border-deep-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold text-slate-200">Top Performers</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Star className="w-4 h-4" />
          <span>Updated hourly</span>
        </div>
      </div>

      <div className="space-y-4">
        {topTraders.map((trader, index) => (
          <div
            key={trader.address}
            className="flex items-center justify-between p-4 bg-deep-purple-800/30 rounded-lg hover:bg-deep-purple-800/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <span className={`text-lg font-bold ${getRankColor(trader.rank)}`}>
                #{trader.rank}
              </span>
              <div>
                <div className="text-slate-200 font-medium">{trader.address}</div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    trader.profit >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trader.profit > 0 ? '+' : ''}{trader.profit}%
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-400">Level: {getXPLevel(trader.xp)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-slate-200">${trader.totalValue.toLocaleString()}</div>
                <div className="text-sm text-slate-400">Total Value</div>
              </div>
              <div className="text-right">
                <div className="text-slate-200">{trader.successRate}%</div>
                <div className="text-sm text-slate-400">Success Rate</div>
              </div>
              <div className="text-right">
                <div className="text-slate-200">{trader.xp.toLocaleString()} XP</div>
                <div className="text-sm text-slate-400">Experience</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardCard;
