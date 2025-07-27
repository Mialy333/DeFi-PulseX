import './App.css'
import ProjectCard from './components/ProjectCard'
import SignalAlert from './components/SignalAlert'
import React, { useState } from 'react'

const projects = [
  {
    name: 'Uniswap',
    logo: '/uniswap-logo.png',
    score: 85,
    chain: 'ETH' as const,
    signal: 'Volume en hausse 🚀',
  },
  {
    name: 'XRPL Dex',
    logo: '/xrpl-logo.png',
    score: 65,
    chain: 'XRP' as const,
    signal: 'Nouveau listing',
  },
  {
    name: 'Aave',
    logo: '/aave-logo.png',
    score: 90,
    chain: 'ETH' as const,
    signal: 'TVL record atteint',
  },
]

function App() {
  const [alert, setAlert] = useState({
    message: "Bienvenue sur PulseX !",
    type: "success",
    show: true,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 py-4 px-6 flex items-center justify-between shadow-sm">
        <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-700 tracking-tight">
          Dashboard DeFi PulseX
        </h1>
        <span className="text-xs text-gray-500 hidden md:inline">Suivi temps réel des projets DeFi</span>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto py-8 px-2">
        {alert.show && (
          <SignalAlert
            message={alert.message}
            type={alert.type}
            show={alert.show}
            onClose={() => setAlert(a => ({ ...a, show: false }))}
          />
        )}

        <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={i} {...p} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default App