import { Link } from 'react-router-dom'
import { Home, RefreshCw, AlertCircle } from 'lucide-react'

const ServerError = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertCircle className="text-red-400" size={48} />
            </div>
          </div>
          <h1 className="text-9xl font-black text-red-400 mb-4">500</h1>
          <h2 className="text-3xl font-bold text-white mb-2">Server Error</h2>
          <p className="text-gray-400">
            Something went wrong on our end. We're working to fix it.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium"
          >
            <RefreshCw size={18} />
            <span>Try Again</span>
          </button>
          <Link to="/">
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#111111] hover:bg-[#1a1a1a] border border-gray-800 text-white rounded-lg transition-colors font-medium w-full sm:w-auto">
              <Home size={18} />
              <span>Go Home</span>
            </button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-[#111111] border border-gray-800 rounded-lg">
          <h3 className="text-white font-bold mb-3">Need Help?</h3>
          <p className="text-gray-400 text-sm mb-4">
            If the problem persists, please contact our support team.
          </p>
          <Link to="/help-center">
            <button className="text-[#6366f1] hover:text-[#5558e3] font-medium text-sm">
              Visit Help Center →
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ServerError
