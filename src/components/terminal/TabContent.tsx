import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import PortfolioSummary from './Portfolio';
import GamificationPanel from '../gamification/GamificationPanel';
import MarketDataView from './MarketData';
import ActiveTrades from './Analytics/ActiveTrades';
import ArbitrageScanner from './Analytics/ArbitrageScanner';
import SwapInterface from './SwapInterface';
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
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <PortfolioSummary 
              walletAddress={walletAddress}
              isLoading={portfolioLoading}
            />
          </div>

          <div className="lg:col-span-1">
            <GamificationPanel profile={profile} />
          </div>

          <div className="lg:col-span-3 xl:col-span-4">
            <MarketDataView marketData={marketData} />
          </div>

          <div className="lg:col-span-2">
            <ActiveTrades />
          </div>

          <div className="lg:col-span-1 xl:col-span-2">
            <ArbitrageScanner />
          </div>
        </div>
      )}

      {/* Portfolio Tab */}
      {activeTab === 'portfolio' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PortfolioSummary 
              walletAddress={walletAddress}
              isLoading={portfolioLoading}
              detailed={true}
            />
          </div>
          <div>
            <GamificationPanel profile={profile} expanded={true} />
          </div>
        </div>
      )}

      {/* Trading Tab */}
      {activeTab === 'trading' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <SwapInterface walletAddress={walletAddress} />
          </div>
          <div className="space-y-6">
            <ActiveTrades expanded={true} />
            <ArbitrageScanner expanded={true} />
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ActiveTrades expanded={true} />
            <ArbitrageScanner expanded={true} />
          </div>
          <div>
            <MarketDataView marketData={marketData} detailed={true} />
          </div>
        </div>
      )}

      {/* Community Tab */}
      {activeTab === 'community' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <GamificationPanel profile={profile} expanded={true} />
          </div>
          <div>
            <ActiveTrades expanded={true} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TabContent;
