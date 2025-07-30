import React, { useState, useCallback } from 'react';
import { ArrowDownUp, Zap } from 'lucide-react';
import { use1InchSwap } from '../../hooks/use1InchSwap';
import type { SwapQuoteParams } from '../../types/swap';
import { useMarketStore } from '../../store/marketStore';

interface SwapFormProps {
  walletAddress?: string;
}

export const SwapForm: React.FC<SwapFormProps> = ({ walletAddress }) => {
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<any>(null);

  const { getSwapQuote, executeSwap, getGasPrice } = use1InchSwap(walletAddress);
  const { marketData } = useMarketStore();

  const handleGetQuote = useCallback(async () => {
    if (!fromToken || !toToken || !amount) return;

    setIsLoading(true);
    try {
      const params: SwapQuoteParams = {
        fromToken,
        toToken,
        amount
      };
      const quoteData = await getSwapQuote(params);
      setQuote(quoteData);
    } catch (error) {
      console.error('Error getting quote:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fromToken, toToken, amount, getSwapQuote]);

  const handleSwap = useCallback(async () => {
    if (!fromToken || !toToken || !amount || !walletAddress) return;

    setIsLoading(true);
    try {
      const swapData = await executeSwap({
        fromToken,
        toToken,
        amount,
        fromAddress: walletAddress,
        slippage: 1 // 1% slippage
      });

      // Here you would handle the actual transaction execution
      console.log('Swap data:', swapData);
    } catch (error) {
      console.error('Error executing swap:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fromToken, toToken, amount, walletAddress, executeSwap]);

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-green-400 mb-4">Swap Tokens</h2>
      
      {/* From Token */}
      <div className="space-y-2">
        <label className="text-sm text-slate-400">From</label>
        <input
          type="text"
          value={fromToken}
          onChange={(e) => setFromToken(e.target.value)}
          placeholder="Token Address"
          className="w-full bg-slate-700/50 rounded px-4 py-2 text-green-400"
        />
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-full bg-slate-700/50 rounded px-4 py-2 text-green-400"
        />
      </div>

      {/* Swap Direction Button */}
      <button 
        onClick={() => {
          const temp = fromToken;
          setFromToken(toToken);
          setToToken(temp);
        }}
        className="mx-auto block p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50"
      >
        <ArrowDownUp className="w-4 h-4" />
      </button>

      {/* To Token */}
      <div className="space-y-2">
        <label className="text-sm text-slate-400">To</label>
        <input
          type="text"
          value={toToken}
          onChange={(e) => setToToken(e.target.value)}
          placeholder="Token Address"
          className="w-full bg-slate-700/50 rounded px-4 py-2 text-green-400"
        />
      </div>

      {/* Quote Information */}
      {quote && (
        <div className="mt-4 p-4 bg-slate-700/30 rounded">
          <div className="text-sm text-slate-400">
            <p>Expected Output: {quote.toTokenAmount}</p>
            <p>Estimated Gas: {quote.estimatedGas}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-x-4 pt-4">
        <button
          onClick={handleGetQuote}
          disabled={isLoading || !fromToken || !toToken || !amount}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-green-400"
        >
          Get Quote
        </button>
        
        <button
          onClick={handleSwap}
          disabled={isLoading || !quote}
          className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white flex items-center space-x-2"
        >
          <Zap className="w-4 h-4" />
          <span>Swap</span>
        </button>
      </div>
    </div>
  );
};
