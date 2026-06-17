import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Users, Target, Sparkles, Briefcase } from 'lucide-react'

const stats = [
  {
    icon: Users,
    label: 'Applications',
    value: 100000,
    suffix: '+',
    prefix: ''
  },
  {
    icon: Target,
    label: 'ATS Accuracy',
    value: 95,
    suffix: '%',
    prefix: ''
  },
  {
    icon: Sparkles,
    label: 'Resume Insights',
    value: 10,
    suffix: 'M+',
    prefix: ''
  },
  {
    icon: Briefcase,
    label: 'Recruiters',
    value: 50000,
    suffix: '+',
    prefix: ''
  }
]

const AnimatedCounter = ({ end, duration = 2, suffix = '', prefix = '' }: { end: number, duration?: number, suffix?: string, prefix?: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1)
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K'
    }
    return num.toString()
  }

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-bold text-white">
      {prefix}{suffix.includes('M') ? count : formatNumber(count)}{suffix}
    </span>
  )
}

const Statistics = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Trusted by thousands.
            <br />
            <span className="bg-gradient-to-r from-dark-accent to-dark-accent-hover bg-clip-text text-transparent">
              Loved by millions.
            </span>
          </h2>
          <p className="text-xl text-dark-text-secondary max-w-2xl mx-auto">
            Join the fastest-growing AI-powered hiring platform
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-dark-card/50 backdrop-blur-xl border border-dark-border rounded-3xl p-8 hover:border-dark-accent/30 transition-all text-center overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-dark-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-dark-bg/50 backdrop-blur-xl border border-dark-border rounded-2xl mb-6 group-hover:scale-110 group-hover:border-dark-accent/50 transition-all">
                    <stat.icon size={28} className="text-dark-accent" />
                  </div>
                  
                  <div className="mb-3">
                    <AnimatedCounter 
                      end={stat.value} 
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                    />
                  </div>
                  
                  <p className="text-lg text-dark-text-secondary font-semibold">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Statistics
