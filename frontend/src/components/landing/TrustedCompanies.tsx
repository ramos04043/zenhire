import { motion } from 'framer-motion'

const companies = [
  'Google', 'Microsoft', 'Amazon', 'OpenAI', 'Netflix', 
  'Adobe', 'Spotify', 'Meta', 'GitHub', 'Stripe',
  'Apple', 'Tesla', 'Airbnb', 'Uber', 'LinkedIn'
]

const TrustedCompanies = () => {
  return (
    <section className="py-16 px-6 border-y border-dark-border bg-dark-card/20 overflow-hidden">
      <div className="max-w-7xl mx-auto mb-8">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-dark-text-secondary font-semibold tracking-wider uppercase"
        >
          Trusted by professionals at world-class companies
        </motion.p>
      </div>

      {/* Scrolling Marquee */}
      <div className="relative">
        <div className="flex overflow-hidden">
          <motion.div 
            className="flex gap-12 pr-12"
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {[...companies, ...companies].map((company, index) => (
              <div
                key={`${company}-${index}`}
                className="flex-shrink-0 px-8 py-4 bg-dark-bg/50 backdrop-blur-xl border border-dark-border rounded-2xl hover:border-dark-accent/30 transition-all"
              >
                <span className="text-xl font-bold text-dark-text-secondary hover:text-white transition-colors whitespace-nowrap">
                  {company}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-dark-bg to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-dark-bg to-transparent pointer-events-none" />
      </div>
    </section>
  )
}

export default TrustedCompanies
