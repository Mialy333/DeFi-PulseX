// components/terminal/Dashboard.tsx - Vue principale du terminal DeFi
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Zap, 
  Globe, 
  AlertTriangle,
  RefreshCw,
  Settings,
  Bell
} from 'lucide-react';

import { useRealTimeData } from '../../hooks/useRealTimeData';
import { usePortfolio } from '../../hooks/usePortfolio';
import { useGamification } from '../../hooks/useGamification';
import { useFusionPlusSwap } from '../../hooks/useFusionPlus';

import PortfolioSummary from './PortfolioSummary';
import SwapInterface from './SwapInterface';
import ArbitrageScanner from './ArbitrageScanner';
import ActiveTrades from './ActiveTrades';
import GamificationPanel from '../gamification/GamificationPanel';

// Types pour les onglets du terminal
type TerminalTab = 'overview' | 'portfolio' | 'trading' | 'analytics' | 'community';

interface DashboardProps {
  walletAddress?: string;
  className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  walletAddress,
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState<TerminalTab>('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Hooks pour les données
  const { marketData, isConnected, lastUpdate } = useRealTimeData({
    tokens: [
      '0xA0b86a33E6886D0c5906C0Ae01fAec12E7e9B85E', // USDC
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
      '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    ],
    updateInterval: 30000
  });

  const { metrics: portfolioMetrics, isLoading: portfolioLoading } = usePortfolio(walletAddress);
  const { profile, engagementMetrics } = useGamification(walletAddress);
  const { swapStats, isInitializing: swapInitializing } = useFusionPlusSwap();

  // Animation variants pour les panels
  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // Forcer un refresh des données
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Calculer les statistiques globales
  const globalStats = {
    totalValue: portfolioMetrics.totalValueUSD,
    pnl24h: portfolioMetrics.totalPnL24h,
    pnlPercentage: portfolioMetrics.pnlPercentage,
    activeSwaps: swapStats.activeSwaps,
    userLevel: profile?.level || 1,
    xpProgress: engagementMetrics.levelProgress
  };

  return (
    <div className={`min-h-screen bg-slate-900 text-green-400 font-mono ${className}`}>
      {/* Header Terminal - Style Bloomberg */}
      <header className="border-b border-green-800/30 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-6 h-6 text-green-400" />
              <h1 className="text-xl font-bold text-green-400">
                DeFi Terminal Pro
              </h1>
            </div>
            
            {/* Indicateur de connexion */}
            <motion.div 
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
                isConnected 
                  ? 'bg-green-900/30 text-green-400' 
                  : 'bg-red-900/30 text-red-400'
              }`}
              animate={{ scale: isConnected ? 1 : [1, 1.05, 1] }}
              transition={{ repeat: isConnected ? 0 : Infinity, duration: 2 }}
            >
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <span>{isConnected ? 'LIVE' : 'DISCONNECTED'}</span>
            </motion.div>
          </div>

          {/* Stats globales en header */}
          <div className="hidden lg:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-slate-300">Portfolio:</span>
              <span className="text-green-400 font-semibold">
                ${globalStats.totalValue.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-slate-300">24h P&L:</span>
              <span className={`font-semibold ${
                globalStats.pnl24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {globalStats.pnl24h >= 0 ? '+' : ''}${globalStats.pnl24h.toFixed(2)}
                ({globalStats.pnlPercentage.toFixed(2)}%)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span className="text-slate-300">Active Swaps:</span>
              <span className="text-amber-400 font-semibold">
                {globalStats.activeSwaps}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-300">Level:</span>
              <span className="text-purple-400 font-semibold">
                {globalStats.userLevel}
              </span>
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={handleRefresh}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95, rotate: 180 }}
              disabled={!isConnected}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>

            <button className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation des onglets */}
        <nav className="flex space-x-0 px-6">
          {[
            { id: 'overview', label: 'OVERVIEW', icon: Activity },
            { id: 'portfolio', label: 'PORTFOLIO', icon: DollarSign },
            { id: 'trading', label: 'TRADING', icon: Zap },
            { id: 'analytics', label: 'ANALYTICS', icon: TrendingUp },
            { id: 'community', label: 'COMMUNITY', icon: Globe }
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TerminalTab)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-green-400 text-green-400 bg-green-900/10'
                  : 'border-transparent text-slate-400 hover:text-green-400 hover:border-green-800'
              }`}
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-semibold">{tab.label}</span>
            </motion.button>
          ))}
        </nav>
      </header>

      {/* Contenu principal */}
      <main className="p-6">
        <motion.div
          key={`${activeTab}-${refreshKey}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={panelVariants}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Vue Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Panel Portfolio résumé */}
              <div className="lg:col-span-2">
                <PortfolioSummary 
                  walletAddress={walletAddress}
                  isLoading={portfolioLoading}
                />
              </div>

              {/* Panel Gamification */}
              <div className="lg:col-span-1">
                <GamificationPanel profile={profile} />
              </div>

              {/* Panel Market Overview */}
              <div className="lg:col-span-3 xl:col-span-4">
                <MarketOverview marketData={marketData} />
              </div>

              {/* Panel Trades actifs */}
              <div className="lg:col-span-2">
                <ActiveTrades />
              </div>

              {/* Panel Scanner arbitrage */}
              <div className="lg:col-span-1 xl:col-span-2">
                <ArbitrageScanner />
              </div>
            </div>
          )}

          {/* Vue Portfolio */}
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

          {/* Vue Trading */}
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

          {/* Vue Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-400 mb-2">
                  Analytics Avancées
                </h3>
                <p className="text-slate-400">
                  Corrélations cross-chain, matrices de liquidité et signaux de trading
                </p>
                <p className="text-sm text-amber-400 mt-2">
                  🚧 En développement pour la phase 2 du hackathon
                </p>
              </div>
            </div>
          )}

          {/* Vue Community */}
          {activeTab === 'community' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-400 mb-2">
                  Communauté DeFi
                </h3>
                <p className="text-slate-400">
                  Insights partagés, leaderboard et récompenses NFT
                </p>
                <p className="text-sm text-amber-400 mt-2">
                  🚧 Interface communautaire en cours de développement
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer avec infos système */}
      <footer className="border-t border-green-800/30 bg-slate-800/30 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-6">
            <span>Last Update: {new Date(lastUpdate).toLocaleTimeString()}</span>
            <span>APIs: 1inch + XRP Ledger</span>
            <span>Network: {isConnected ? 'Online' : 'Offline'}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span>Hackathon Mode</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;