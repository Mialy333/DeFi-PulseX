import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const WalletConnect: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [isHovering, setIsHovering] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="relative">
      {isConnected && address ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => disconnect()}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span className="text-sm font-medium">
            {isHovering ? 'Disconnect' : formatAddress(address)}
          </span>
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            // Pre-warm MetaMask connection
            if (typeof window.ethereum !== 'undefined') {
              window.ethereum.request({ method: 'eth_accounts' });
            }
            connect({ connector: connectors[0] });
          }}
          disabled={isPending}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-75"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Connecting...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 404 420" fill="none">
                <path d="M404 58.9798C404 26.4175 377.582 0 345.02 0H58.9798C26.4175 0 0 26.4175 0 58.9798V360.431C0 392.993 26.4175 419.411 58.9798 419.411H345.02C377.582 419.411 404 392.993 404 360.431V58.9798Z" fill="#E17726"/>
              </svg>
              <span className="text-sm font-medium">Connect MetaMask</span>
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default WalletConnect;
