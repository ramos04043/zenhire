import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-black text-[#6366f1] mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-2">Page Not Found</h2>
          <p className="text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium w-full sm:w-auto">
              <Home size={18} />
              <span>Go Home</span>
            </button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#111111] hover:bg-[#1a1a1a] border border-gray-800 text-white rounded-lg transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>

        <div className="mt-12 p-6 bg-[#111111] border border-gray-800 rounded-lg">
          <h3 className="text-white font-bold mb-3">Quick Links</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link to="/dashboard" className="text-[#6366f1] hover:text-[#5558e3]">Dashboard</Link>
            <Link to="/jobs" className="text-[#6366f1] hover:text-[#5558e3]">Jobs</Link>
            <Link to="/resume" className="text-[#6366f1] hover:text-[#5558e3]">Resume</Link>
            <Link to="/applications" className="text-[#6366f1] hover:text-[#5558e3]">Applications</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
