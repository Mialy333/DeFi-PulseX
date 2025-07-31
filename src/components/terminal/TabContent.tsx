import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { BarChart3, Flame } from 'lucide-react';
import PortfolioSummary from './Portfolio';
import GamificationPanel from '../gamification/GamificationPanel';
import NewsGrid from './NewsGrid';
import MarketDataView from './MarketData';
import ActiveTrades from './Analytics/ActiveTrades';
import ArbitrageScanner from './Analytics/ArbitrageScanner';
import SwapInterface from './SwapInterface';
import Charts from './Analytics/Charts';
import type { MarketData, UserProfile } from '../../types/api';

interface TabContentProps {
  activeTab: 'overview' | 'portfolio' | 'trading' | 'analytics' | 'community';
  refreshKey: number;
  walletAddress?: string;
  portfolioLoading: boolean;
  marketData: Record<string, MarketData>;
  profile?: UserProfile;
}

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  refreshKey,
  walletAddress,
  portfolioLoading,
  marketData,
  profile
}) => {
  return (
    <motion.div
      key={`${activeTab}-${refreshKey}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={panelVariants}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* News Grid */}
          <div className="lg:col-span-12">
            <NewsGrid />
          </div>

          {/* Market Overview Grid */}
          <div className="lg:col-span-12">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-slate-400" />
                  <h2 className="text-lg font-semibold text-slate-200">Market Overview</h2>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-slate-400">
                      <th className="pb-4 text-left">Asset</th>
                      <th className="pb-4 text-right">Price</th>
                      <th className="pb-4 text-right whitespace-nowrap">7d Evolution & 24h Change</th>
                      <th className="pb-4 text-right">Volume (24h)</th>
                      <th className="pb-4 text-right">Market Cap</th>
                      <th className="pb-4 text-right">Circulating Supply</th>
                      <th className="pb-4 text-right">Max Supply</th>
                      <th className="pb-4 text-right">Staking Yield</th>
                      <th className="pb-4 text-right">Inflation Rate</th>
                      <th className="pb-4 text-right">Total Staked</th>
                      <th className="pb-4 text-right">Burning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        symbol: 'BTC',
                        name: 'Bitcoin',
                        price: 43567.89,
                        change24h: 2.45,
                        marketCap: 846234567890,
                        volume24h: 28456789012,
                        circulatingSupply: 19458632,
                        maxSupply: 21000000,
                        tokenomics: {
                          burningMechanism: 'None',
                          stakingYield: 'N/A',
                          inflationRate: 1.7,
                          totalStaked: 'N/A'
                        }
                      },
                      {
                        symbol: 'ETH',
                        name: 'Ethereum',
                        price: 2345.67,
                        change24h: 3.21,
                        marketCap: 287654321098,
                        volume24h: 15678901234,
                        circulatingSupply: 120345678,
                        maxSupply: null,
                        tokenomics: {
                          burningMechanism: 'EIP-1559',
                          stakingYield: '4-6%',
                          inflationRate: -0.5,
                          totalStaked: '25678901 ETH'
                        }
                      },
                      {
                        symbol: 'BNB',
                        name: 'Binance Coin',
                        price: 312.45,
                        change24h: 1.23,
                        marketCap: 48765432109,
                        volume24h: 2345678901,
                        circulatingSupply: 156789012,
                        maxSupply: 200000000,
                        tokenomics: {
                          burningMechanism: 'Quarterly',
                          stakingYield: '5-12%',
                          inflationRate: -2.1,
                          totalStaked: '45678901 BNB'
                        }
                      },
                      {
                        symbol: 'SOL',
                        name: 'Solana',
                        price: 89.32,
                        change24h: 5.67,
                        marketCap: 36789012345,
                        volume24h: 3456789012,
                        circulatingSupply: 412345678,
                        maxSupply: null,
                        tokenomics: {
                          burningMechanism: 'Transaction fees',
                          stakingYield: '6-8%',
                          inflationRate: 4.5,
                          totalStaked: '234567890 SOL'
                        }
                      },
                      {
                        symbol: 'ADA',
                        name: 'Cardano',
                        price: 0.567,
                        change24h: -1.23,
                        marketCap: 19876543210,
                        volume24h: 987654321,
                        circulatingSupply: 35012345678,
                        maxSupply: 45000000000,
                        tokenomics: {
                          burningMechanism: 'None',
                          stakingYield: '4-5%',
                          inflationRate: 0.3,
                          totalStaked: '25678901234 ADA'
                        }
                      },
                      {
                        symbol: 'DOT',
                        name: 'Polkadot',
                        price: 7.89,
                        change24h: 4.56,
                        marketCap: 9876543210,
                        volume24h: 876543210,
                        circulatingSupply: 1234567890,
                        maxSupply: null,
                        tokenomics: {
                          burningMechanism: 'Treasury',
                          stakingYield: '10-14%',
                          inflationRate: 8.5,
                          totalStaked: '654321098 DOT'
                        }
                      },
                      {
                        symbol: 'AVAX',
                        name: 'Avalanche',
                        price: 34.56,
                        change24h: -2.34,
                        marketCap: 7654321098,
                        volume24h: 654321098,
                        circulatingSupply: 345678901,
                        maxSupply: 720000000,
                        tokenomics: {
                          burningMechanism: 'Transaction fees',
                          stakingYield: '8-11%',
                          inflationRate: -1.2,
                          totalStaked: '123456789 AVAX'
                        }
                      }
                    ].map((asset) => (
                      <tr key={asset.symbol} className="text-sm border-t border-slate-700/50">
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <img 
                              src={`/tokens/${asset.symbol.toLowerCase()}.png`}
                              alt={asset.symbol}
                              className="w-6 h-6 rounded-full"
                            />
                            <div>
                              <div className="font-medium text-slate-200">{asset.symbol}</div>
                              <div className="text-xs text-slate-400">{asset.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-right font-medium text-slate-200">
                          ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-24 h-8">
                              <svg viewBox="0 0 100 30" className="w-full h-full">
                                <path
                                  d={`M 0 ${15 + (Math.random() * 10)} ${Array.from({ length: 10 }, (_, i) => 
                                    `L ${i * 11} ${15 + (Math.sin(i) * (Math.random() * 10))}`).join(' ')}`}
                                  fill="none"
                                  stroke={asset.change24h >= 0 ? '#4ade80' : '#f87171'}
                                  strokeWidth="2"
                                />
                              </svg>
                            </div>
                            <span className={asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                              {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-right text-slate-300">
                          ${(asset.volume24h / 1e9).toFixed(2)}B
                        </td>
                        <td className="py-4 text-right text-slate-300">
                          ${(asset.marketCap / 1e9).toFixed(2)}B
                        </td>
                        <td className="py-4 text-right text-slate-300">
                          {(asset.circulatingSupply / 1e6).toFixed(2)}M
                        </td>
                        <td className="py-4 text-right text-slate-300">
                          {asset.maxSupply ? `${(asset.maxSupply / 1e6).toFixed(2)}M` : '∞'}
                        </td>
                        <td className="py-4 text-right text-slate-300">
                          {asset.tokenomics.stakingYield}
                        </td>
                        <td className="py-4 text-right">
                          <span className={asset.tokenomics.inflationRate <= 0 ? 'text-green-400' : 'text-yellow-400'}>
                            {asset.tokenomics.inflationRate}%
                          </span>
                        </td>
                        <td className="py-4 text-right text-slate-300">
                          {asset.tokenomics.totalStaked}
                        </td>
                        <td className="py-4 text-right text-slate-300">
                          <div className="flex items-center justify-end gap-1">
                            {asset.tokenomics.burningMechanism !== 'None' && (
                              <Flame className="w-4 h-4 text-orange-400" />
                            )}
                            <span>{asset.tokenomics.burningMechanism}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Tab */}
      {activeTab === 'portfolio' && (
        <div className="grid grid-cols-12 gap-6">
          {/* First row: Portfolio Overview */}
          <div className="col-span-12">
            <PortfolioSummary 
              walletAddress={walletAddress}
              isLoading={portfolioLoading}
              detailed={true}
            />
          </div>

          {/* Second row: Portfolio Performance Chart */}
          <div className="col-span-12">
            <Charts 
              type="portfolio"
              walletAddress={walletAddress}
              timeframes={['1D', '1W', '1M', '3M', '6M', '1Y', '3Y', '5Y', 'YTD', 'YOY']}
            />
          </div>

          {/* Third row: Active Positions */}
          <div className="col-span-12">
            <ActiveTrades expanded={true} />
          </div>
        </div>
      )}

      {/* Trading Tab */}
      {activeTab === 'trading' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <SwapInterface walletAddress={walletAddress} />
          </div>
          <div className="col-span-4 space-y-6">
            <ActiveTrades expanded={true} />
            <ArbitrageScanner expanded={true} />
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-6">
            <ActiveTrades expanded={true} />
            <ArbitrageScanner expanded={true} />
          </div>
          <div className="col-span-4">
            <MarketDataView marketData={marketData} detailed={true} />
          </div>
        </div>
      )}

      {/* Community Tab */}
      {activeTab === 'community' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-9">
            <GamificationPanel profile={profile} expanded={true} />
          </div>
          <div className="col-span-3">
            <ActiveTrades expanded={true} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TabContent;
