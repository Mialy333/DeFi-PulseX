// src/App.tsx
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Import de notre composant Dashboard principal
// Le chemin relatif './components/terminal/Dashboard' indique à TypeScript 
// d'aller chercher le fichier Dashboard.tsx dans le dossier components/terminal
import Dashboard from './components/terminal/Dashboard';

// Import du hook de test de connexion proxy
// Ce hook nous permettra de vérifier que notre infrastructure API fonctionne
import { useProxyConnection } from './services/api/oneinch/proxyClient';

// Adresse de démonstration pour le hackathon
// Dans une vraie application, cette adresse viendrait de la connexion wallet
const DEMO_WALLET_ADDRESS = '0x742d35Cc5b8C8CBE8f3B2b4B8e5D8C8b8c8c8c8c';

function App() {
  // État local pour gérer l'adresse du wallet
  // useState nous permet de changer dynamiquement l'adresse selon l'utilisateur connecté
  const [walletAddress, setWalletAddress] = useState<string | undefined>(DEMO_WALLET_ADDRESS);
  
  // État pour gérer le chargement initial de l'application
  // Cette approche améliore l'expérience utilisateur en évitant l'affichage prématuré d'éléments
  const [isLoading, setIsLoading] = useState(true);
  
  // Hook personnalisé pour tester la connectivité de notre proxy 1inch
  // Ce test est crucial car sans proxy fonctionnel, nos APIs ne marcheront pas
  const { isConnected, isLoading: proxyLoading, error: proxyError } = useProxyConnection();

  // Effet pour simuler un temps de chargement initial réaliste
  // Dans une vraie application, ce serait le temps de chargement des données critiques
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Écran de chargement avec esthétique terminal
  // Cette approche crée une transition fluide vers l'interface principale
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-green-400 mb-2 font-mono">
            DeFi Terminal Pro
          </h1>
          <p className="text-slate-400 font-mono">
            Initializing cross-chain protocols...
          </p>
          <div className="mt-4 text-xs text-slate-500 font-mono space-y-1">
            <div>✓ Loading 1inch APIs</div>
            <div>✓ Connecting to XRP Ledger</div>
            <div>✓ Initializing atomic swap protocols</div>
            <div className="text-green-400">✓ Ready for trading</div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Gestion d'erreur de connexion proxy
  // Cette approche offre une expérience utilisateur claire en cas de problème technique
  if (proxyError && !isConnected) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800 border border-red-600/50 rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠️</span>
          </div>
          
          <h2 className="text-xl font-bold text-red-400 mb-2">
            Connection Error
          </h2>
          
          <p className="text-slate-400 mb-6">
            Unable to connect to 1inch APIs. Please check your proxy configuration.
          </p>
          
          <div className="text-left bg-slate-900/50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">
              Quick Fix:
            </h3>
            <ol className="text-xs text-slate-400 space-y-1">
              <li>1. Deploy proxy to Vercel</li>
              <li>2. Set ONEINCH_API_KEY environment variable</li>
              <li>3. Restart the application</li>
            </ol>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-red-400 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Interface principale de l'application
  // C'est ici que nous utilisons notre composant Dashboard importé
  return (
    <div className="App">
      {/* 
        Utilisation du composant Dashboard importé
        Nous passons walletAddress comme prop pour que Dashboard puisse 
        personnaliser l'expérience selon l'utilisateur connecté
      */}
      <Dashboard walletAddress={walletAddress} />
      
      {/* 
        Système de notifications global
        Toaster doit être placé à ce niveau pour être accessible 
        à tous les composants enfants de l'application
      */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #475569',
            borderRadius: '0.75rem',
            fontFamily: 'monospace'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#1e293b',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1e293b',
            },
          },
        }}
      />

      {/* 
        Indicateur de connexion proxy en bas de l'écran
        Cette information est cruciale pour le debugging pendant le développement
      */}
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {!isConnected && !proxyLoading && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-amber-900/90 border border-amber-600/50 rounded-lg px-4 py-2 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-2 text-amber-400">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Connecting to APIs...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;