import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Play } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import DashboardPreview from './DashboardPreview'

const Hero = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-accent/10 via-transparent to-dark-accent/5 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dark-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-dark-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-card/50 backdrop-blur-xl border border-dark-border rounded-full shadow-lg">
            <Sparkles size={16} className="text-dark-accent animate-pulse" />
            <span className="text-sm font-semibold text-dark-text-secondary">
              Powered by Advanced AI
            </span>
            <span className="px-2 py-0.5 bg-dark-accent/10 text-dark-accent text-xs font-bold rounded-full">
              NEW
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-none">
            <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              AI-Powered Hiring.
            </span>
            <br />
            <span className="bg-gradient-to-r from-dark-accent to-dark-accent-hover bg-clip-text text-transparent">
              From Resume to Offer.
            </span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-dark-text-secondary max-w-4xl mx-auto leading-relaxed font-light"
          >
            One intelligent platform for candidates and recruiters. Track applications, 
            optimize resumes, prepare for interviews, and hire faster with AI.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20"
        >
          {isAuthenticated ? (
            <Link to="/dashboard">
              <button className="group px-8 py-4 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-2xl font-semibold transition-all inline-flex items-center gap-3 shadow-glow hover:shadow-glow-sm hover:scale-105">
                Go to Dashboard
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <button className="group px-8 py-4 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-2xl font-semibold transition-all inline-flex items-center gap-3 shadow-glow hover:shadow-glow-sm hover:scale-105">
                  Start Free
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <button className="group px-8 py-4 bg-dark-card/50 backdrop-blur-xl hover:bg-dark-card border border-dark-border hover:border-dark-accent/50 text-dark-text-primary rounded-2xl font-semibold transition-all inline-flex items-center gap-3 hover:scale-105">
                <Play size={20} className="group-hover:scale-110 transition-transform" />
                Book Demo
              </button>
            </>
          )}
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
