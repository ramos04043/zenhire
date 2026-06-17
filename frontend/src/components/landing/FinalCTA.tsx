import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const FinalCTA = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-accent/10 via-transparent to-dark-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-dark-accent/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-dark-accent/10 rounded-full blur-[120px]" />
      
      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-dark-card/50 backdrop-blur-2xl border border-dark-border rounded-[32px] p-12 md:p-16 text-center shadow-2xl"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-dark-accent/10 border border-dark-accent/20 rounded-full mb-8"
          >
            <Sparkles size={16} className="text-dark-accent" />
            <span className="text-sm font-semibold text-dark-accent">
              Join 100,000+ Professionals
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
          >
            Ready to Land Your
            <br />
            <span className="bg-gradient-to-r from-dark-accent to-dark-accent-hover bg-clip-text text-transparent">
              Dream Job?
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-dark-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {isAuthenticated 
              ? 'Continue your journey and land your dream job with AI-powered tools.'
              : 'Start using AI to get hired faster. No credit card required.'}
            <br />
            {!isAuthenticated && 'Free forever plan available.'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            {isAuthenticated ? (
              <Link to="/dashboard">
                <button className="group px-10 py-5 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-2xl font-semibold text-lg transition-all inline-flex items-center gap-3 shadow-glow hover:shadow-glow-sm hover:scale-105">
                  Go to Dashboard
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <button className="group px-10 py-5 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-2xl font-semibold text-lg transition-all inline-flex items-center gap-3 shadow-glow hover:shadow-glow-sm hover:scale-105">
                    Start Free
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                
                <button className="group px-10 py-5 bg-dark-bg/50 backdrop-blur-xl hover:bg-dark-card border border-dark-border hover:border-dark-accent/50 text-white rounded-2xl font-semibold text-lg transition-all inline-flex items-center gap-3 hover:scale-105">
                  <Play size={22} className="group-hover:scale-110 transition-transform" />
                  Book Demo
                </button>
              </>
            )}
          </motion.div>

          {/* Trust Indicators */}
          {!isAuthenticated && (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center items-center gap-8 mt-12 text-sm text-dark-text-secondary"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default FinalCTA
