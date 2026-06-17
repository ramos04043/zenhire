import { motion } from 'framer-motion'
import { 
  Upload, Sparkles, Target, Calendar, 
  Send, TrendingUp, Trophy, ArrowRight 
} from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: 'Upload Resume',
    description: 'Start by uploading your resume in any format',
    color: 'blue'
  },
  {
    icon: Sparkles,
    title: 'AI Analysis',
    description: 'Our AI analyzes your skills, experience, and strengths',
    color: 'purple'
  },
  {
    icon: Target,
    title: 'ATS Score',
    description: 'Get your ATS compatibility score and optimization tips',
    color: 'orange'
  },
  {
    icon: Calendar,
    title: 'Interview Prep',
    description: 'Access tailored interview questions and preparation guides',
    color: 'green'
  },
  {
    icon: Send,
    title: 'Apply',
    description: 'Apply to jobs with optimized resumes and cover letters',
    color: 'cyan'
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor your applications in real-time with visual pipelines',
    color: 'pink'
  },
  {
    icon: Trophy,
    title: 'Get Hired',
    description: 'Land your dream job faster with AI-powered insights',
    color: 'yellow'
  }
]

const AIWorkflow = () => {
  return (
    <section className="py-32 px-6 bg-dark-card/20 border-y border-dark-border">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-card/50 backdrop-blur-xl border border-dark-border rounded-full mb-6">
            <Sparkles size={16} className="text-dark-accent" />
            <span className="text-sm font-semibold text-dark-text-secondary">How It Works</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Your AI-powered
            <br />
            <span className="bg-gradient-to-r from-dark-accent to-dark-accent-hover bg-clip-text text-transparent">
              hiring journey
            </span>
          </h2>
          <p className="text-xl text-dark-text-secondary max-w-2xl mx-auto">
            From resume upload to job offer in seven intelligent steps
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-dark-accent via-dark-accent/50 to-transparent hidden lg:block" />

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-start gap-8">
                  {/* Icon Circle */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 bg-dark-card backdrop-blur-xl border-2 border-dark-accent rounded-2xl flex items-center justify-center shadow-glow-sm z-10 relative">
                      <step.icon size={28} className="text-dark-accent" />
                    </div>
                    {/* Connecting Arrow */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-20 left-1/2 -translate-x-1/2 hidden lg:block">
                        <ArrowRight size={20} className="text-dark-accent rotate-90" />
                      </div>
                    )}
                  </div>

                  {/* Content Card */}
                  <motion.div 
                    className="flex-1 bg-dark-card/50 backdrop-blur-xl border border-dark-border rounded-2xl p-8 hover:border-dark-accent/30 transition-all group cursor-pointer"
                    whileHover={{ scale: 1.02, x: 10 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-sm font-bold text-dark-accent mb-2 block">
                          Step {index + 1}
                        </span>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-dark-accent transition-colors">
                          {step.title}
                        </h3>
                      </div>
                      <div className="w-10 h-10 bg-dark-bg/50 backdrop-blur-xl border border-dark-border rounded-xl flex items-center justify-center text-lg font-bold text-dark-accent">
                        {index + 1}
                      </div>
                    </div>
                    <p className="text-dark-text-secondary text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-20"
        >
          <button className="group px-8 py-4 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-2xl font-semibold transition-all inline-flex items-center gap-3 shadow-glow hover:shadow-glow-sm hover:scale-105">
            Start Your Journey
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default AIWorkflow
