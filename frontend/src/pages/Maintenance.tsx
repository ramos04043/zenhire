import { Wrench, Clock } from 'lucide-react'

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-[#6366f1]/10 rounded-full flex items-center justify-center">
              <Wrench className="text-[#6366f1]" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Under Maintenance</h1>
          <p className="text-gray-400 mb-6">
            We're currently performing scheduled maintenance to improve your experience. 
            We'll be back shortly.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Clock size={16} />
            <span className="text-sm">Estimated time: 2 hours</span>
          </div>
        </div>

        <div className="p-6 bg-[#111111] border border-gray-800 rounded-lg">
          <h3 className="text-white font-bold mb-3">What's Being Updated?</h3>
          <ul className="space-y-2 text-sm text-gray-400 text-left">
            <li>• Performance improvements</li>
            <li>• New AI features</li>
            <li>• Bug fixes and security updates</li>
            <li>• Enhanced user experience</li>
          </ul>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Follow us on social media for updates
        </p>
      </div>
    </div>
  )
}

export default Maintenance
