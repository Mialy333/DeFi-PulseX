import './App.css'
import ProjectCard from './components/ProjectCard'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard DeFi PulseX</h1>
      <ProjectCard name={''} logo={''} score={0} chain={'ETH'} signal={''} />
    </div>
  )
}

export default App
