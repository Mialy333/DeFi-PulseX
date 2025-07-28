// components/terminal/SwapInterface.tsx - Interface de swap cross-chain
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDownUp, 
  Zap, 
  Clock, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  TrendingUp,
  Info,
  ExternalLink
} from 'lucide-react';

import { useFusionPlusSwap } from '../../hooks/useFusionPlusSwap';
import { useGamification } from '../../hooks/useGamification';
import { useMarketStore } from '../../store/marketStore';
import { formatCurrency, formatTimeRemaining } from '../../utils/formatters';

interface SwapInterfaceProps {
  walletAddress?: string;
  className?: string;
}

type SwapDirection = 'ETH_to_XRP' | 'XRP_to_ETH';

const SwapInterface: React.FC<SwapInterfaceProps> = ({ 
  walletAddress, 
  className = '' 
}) => {
  // États du swap
  const [direction, setDirection] = useState<SwapDirection>('ETH_to_XRP');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [swapEstimate, setSwapEstimate] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Hooks
  const {
    swapETHtoXRP,
    swapXRPtoETH,
    isInitializing,
    swapProgress,
    crossChainSwaps,
    swapStats
  } = useFusionPlusSwap();
  
  const { rewardTrade } = useGamification(walletAddress);
  const { marketData } = useMarketStore();

  // Prix de référence (simulés pour la démo)
  const prices = {
    ETH: 2000, // $2000 par ETH
    XRP: 0.50   // $0.50 par XRP
  };

  // Calculer le montant de sortie estimé
  const calculateOutput = useCallback(async (input: string) => {
    if (!input || parseFloat(input) <= 0) {
      setToAmount('');
      setSwapEstimate(null);
      return;
    }

    setIsCalculating(true);
    
    try {
      // Simulation du calcul (dans une vraie app, on appellerait l'API 1inch)
      const inputAmount = parseFloat(input);
      let outputAmount: number;
      let exchangeRate: number;
      
      if (direction === 'ETH_to_XRP') {
        // ETH vers XRP
        const ethValueUSD = inputAmount * prices.ETH;
        outputAmount = ethValueUSD / prices.XRP;
        exchangeRate = outputAmount / inputAmount;
      } else {
        // XRP vers ETH
        const xrpValueUSD = inputAmount * prices.XRP;
        outputAmount = xrpValueUSD / prices.ETH;
        exchangeRate = outputAmount / inputAmount;
      }

      // Simuler des frais et slippage
      const networkFee = direction === 'ETH_to_XRP' ? 0.003 : 50; // 0.003 ETH ou 50 XRP
      const slippage = 0.005; // 0.5%
      const finalOutput = outputAmount * (1 - slippage);

      setToAmount(finalOutput.toFixed(6));
      setSwapEstimate({
        inputAmount,
        outputAmount: finalOutput,
        exchangeRate,
        networkFee,
        slippage: slippage * 100,
        priceImpact: 0.1, // 0.1%
        estimatedTime: '2-5 minutes' // Temps d'atomic swap
      });

    } catch (error) {
      console.error('Erreur de calcul:', error);
      setToAmount('');
      setSwapEstimate(null);
    } finally {
      setIsCalculating(false);
    }
  }, [direction, prices]);

  // Effet pour recalculer quand le montant change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateOutput(fromAmount);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [fromAmount, calculateOutput]);

  // Inverser la direction du swap
  const flipDirection = () => {
    setDirection(direction === 'ETH_to_XRP' ? 'XRP_to_ETH' : 'ETH_to_XRP');
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // Exécuter le swap
  const executeSwap = async () => {
    if (!walletAddress || !swapEstimate) return;

    try {
      let result;
      
      if (direction === 'ETH_to_XRP') {
        result = await swapETHtoXRP(
          fromAmount,
          toAmount,
          'rXRPDestinationAddress' // Adresse XRP de destination
        );
      } else {
        result = await swapXRPtoETH(
          fromAmount,
          toAmount,
          walletAddress // Adresse ETH de destination
        );
      }

      if (result.success) {
        // Récompenser l'utilisateur avec des XP
        rewardTrade();
        
        // Reset du formulaire
        setFromAmount('');
        setToAmount('');
        setSwapEstimate(null);
      }

    } catch (error) {
      console.error('Erreur lors du swap:', error);
    }
  };

  const fromToken = direction === 'ETH_to_XRP' ? 'ETH' : 'XRP';
  const toToken = direction === 'ETH_to_XRP' ? 'XRP' : 'ETH';

  return (
    <div className={`bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-900/30 rounded-lg">
              <Zap className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-400">
                Cross-Chain Swap
              </h3>
              <p className="text-sm text-slate-400">
                Atomic swaps powered by Fusion+
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400">Trustless</span>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-slate-900/50 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-slate-400">Total Swaps</div>
            <div className="text-lg font-semibold text-green-400">
              {swapStats.totalSwaps}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-400">Active</div>
            <div className="text-lg font-semibold text-amber-400">
              {swapStats.activeSwaps}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-400">Success Rate</div>
            <div className="text-lg font-semibold text-green-400">
              {swapStats.totalSwaps > 0 
                ? ((swapStats.completedSwaps / swapStats.totalSwaps) * 100).toFixed(1)
                : '0'
              }%
            </div>
          </div>
        </div>
      </div>

      {/* Interface de swap */}
      <div className="p-6 space-y-4">
        {/* Token FROM */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400">From</label>
          <div className="relative">
            <div className="flex items-center space-x-3 p-4 bg-slate-900/50 border border-slate-600/50 rounded-lg">
              <div className="flex items-center space-x-2 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  fromToken === 'ETH' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {fromToken}
                </div>
                <div>
                  <div className="font-semibold text-white">{fromToken}</div>
                  <div className="text-xs text-slate-400">
                    ${prices[fromToken as keyof typeof prices].toFixed(2)}
                  </div>
                </div>
              </div>
              
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.0"
                className="flex-1 bg-transparent text-right text-xl font-semibold text-white placeholder-slate-500 outline-none"
                disabled={isInitializing}
              />
            </div>
          </div>
        </div>

        {/* Bouton flip */}
        <div className="flex justify-center">
          <motion.button
            onClick={flipDirection}
            className="p-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: 180 }}
            disabled={isInitializing}
          >
            <ArrowDownUp className="w-5 h-5 text-green-400" />
          </motion.button>
        </div>

        {/* Token TO */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400">To</label>
          <div className="relative">
            <div className="flex items-center space-x-3 p-4 bg-slate-900/50 border border-slate-600/50 rounded-lg">
              <div className="flex items-center space-x-2 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  toToken === 'XRP' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-blue-600 text-white'
                }`}>
                  {toToken}
                </div>
                <div>
                  <div className="font-semibold text-white">{toToken}</div>
                  <div className="text-xs text-slate-400">
                    ${prices[toToken as keyof typeof prices].toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 text-right">
                {isCalculating ? (
                  <Loader2 className="w-5 h-5 animate-spin text-green-400 ml-auto" />
                ) : (
                  <div className="text-xl font-semibold text-white">
                    {toAmount || '0.0'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Détails du swap */}
        <AnimatePresence>
          {swapEstimate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 p-4 bg-slate-900/30 border border-slate-700/30 rounded-lg"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Exchange Rate</span>
                <span className="text-white">
                  1 {fromToken} = {swapEstimate.exchangeRate.toFixed(4)} {toToken}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Network Fee</span>
                <span className="text-white">
                  {swapEstimate.networkFee} {fromToken}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Slippage</span>
                <span className="text-amber-400">
                  {swapEstimate.slippage.toFixed(2)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Estimated Time</span>
                <div className="flex items-center space-x-1 text-green-400">
                  <Clock className="w-3 h-3" />
                  <span>{swapEstimate.estimatedTime}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/50">
                <div className="flex items-center space-x-2 text-xs text-blue-400">
                  <Info className="w-3 h-3" />
                  <span>Atomic swap ensures either both parties receive funds or neither does</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progression du swap en cours */}
        <AnimatePresence>
          {(isInitializing || swapProgress) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-amber-900/20 border border-amber-600/30 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                <div>
                  <div className="font-semibold text-amber-400">
                    {isInitializing ? 'Initializing Cross-Chain Clients...' : 'Processing Swap'}
                  </div>
                  <div className="text-sm text-amber-300">
                    {swapProgress || 'Please wait...'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bouton de swap */}
        <motion.button
          onClick={executeSwap}
          disabled={
            !walletAddress || 
            !fromAmount || 
            !toAmount || 
            !swapEstimate ||
            isInitializing
          }
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
            !walletAddress || !fromAmount || !toAmount || !swapEstimate || isInitializing
              ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white shadow-lg shadow-green-500/25'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {!walletAddress 
            ? 'Connect Wallet' 
            : isInitializing
            ? 'Initializing...'
            : `Swap ${fromToken} for ${toToken}`
          }
        </motion.button>

        {/* Options avancées */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full text-sm text-slate-400 hover:text-green-400 transition-colors"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 p-4 bg-slate-900/30 border border-slate-700/30 rounded-lg"
            >
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Slippage Tolerance
                </label>
                <div className="flex space-x-2">
                  {[0.1, 0.5, 1.0, 2.0].map(slippage => (
                    <button
                      key={slippage}
                      className="px-3 py-2 text-sm bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg transition-colors"
                    >
                      {slippage}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Deadline
                </label>
                <select className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white">
                  <option value="10">10 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="1440">24 hours</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer avec liens utiles */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-4">
            <a href="#" className="flex items-center space-x-1 hover:text-green-400 transition-colors">
              <ExternalLink className="w-3 h-3" />
              <span>How Atomic Swaps Work</span>
            </a>
            <a href="#" className="flex items-center space-x-1 hover:text-green-400 transition-colors">
              <TrendingUp className="w-3 h-3" />
              <span>View on Explorer</span>
            </a>
          </div>
          <div>
            Powered by 1inch Fusion+
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapInterface;