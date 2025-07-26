import React from 'react'

type Props = {
  name: string
  logo: string
  score: number
  chain: 'ETH' | 'XRP'
  signal: string
}

const SUPPORTED_CHAINS = {
  ETH: 'ETH', // 1inch uses token addresses, but keeping simple for now
  // XRP is not supported in 1inch – handle that
}

export default function ProjectCard({ name, logo, score, chain, signal }: Props) {
  const isEligible = score >= 70
  const isChainSupported = chain in SUPPORTED_CHAINS

  const handleSwap = () => {
    if (!isChainSupported) return
    const url = `https://app.1inch.io/#/1/simple/swap/${SUPPORTED_CHAINS[chain]}`
    window.open(url, '_blank')
  }

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder-logo.png' 
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt={`${name} logo`}
            onError={handleImgError}
            className="w-10 h-10 rounded-full object-contain"
          />
          <h2 className="text-lg font-semibold">{name}</h2>
        </div>
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            isEligible ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          Score: {score}
        </span>
      </div>
      <p className="mt-2 text-gray-600 text-sm" aria-label="Signal fondamental">
        📢 {signal}
      </p>
      {isEligible ? (
        isChainSupported ? (
          <button
            onClick={handleSwap}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl transition"
            aria-label="Swap this asset via 1inch"
          >
            Swap via 1inch
          </button>
        ) : (
          <p className="mt-4 text-sm text-red-500">Swap non disponible sur {chain}</p>
        )
      ) : (
        <p className="mt-4 text-sm text-gray-400">Ce projet n’est pas éligible au swap</p>
      )}
    </div>
  )
}
