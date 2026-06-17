import { motion } from 'framer-motion'
import { 
  Sparkles, Target, TrendingUp, Calendar, 
  Zap, Shield, Brain, Users, 
  BarChart3, FileText, MessageSquare, Award 
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Resume Analysis',
    description: 'Get instant feedback on your resume with our advanced AI. Identify gaps, optimize keywords, and maximize ATS compatibility.',
    span: 'lg:col-span-2 lg:row-span-2',
    gradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    icon: Target,
    title: 'Real-Time Tracking',
    description: 'Track every application from submission to offer with visual pipelines.',
    span: 'lg:col-span-1',
    gradient: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    icon: TrendingUp,
    title: 'ATS Score',
    description: 'Know your chances before you apply. Our AI scores your resume against job requirements.',
    span: 'lg:col-span-1',
    gradient: 'from-orange-500/20 to-red-500/20'
  },
  {
    icon: Calendar,
    title: 'Interview Prep',
    description: 'Manage interviews, set reminders, and access company-specific preparation materials.',
    span: 'lg:col-span-1',
    gradient: 'from-green-500/20 to-emerald-500/20'
  },
  {
    icon: Zap,
    title: 'Smart Matching',
    description: 'AI-powered job matching based on your skills, experience, and career goals.',
    span: 'lg:col-span-1',
    gradient: 'from-yellow-500/20 to-orange-500/20'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Visualize your job search progress with beautiful charts and insights.',
    span: 'lg:col-span-2',
    gradient: 'from-indigo-500/20 to-purple-500/20'
  },
  {
    icon: Users,
    title: 'Recruiter Portal',
    description: 'Dedicated dashboard for recruiters to manage candidates and streamline hiring.',
    span: 'lg:col-span-1',
    gradient: 'from-pink-500/20 to-rose-500/20'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and data privacy. Your information is always protected.',
    span: 'lg:col-span-1',
    gradient: 'from-slate-500/20 to-zinc-500/20'
  },
]

const FeaturesBento = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-card/50 backdrop-blur-xl border border-dark-border rounded-full mb-6">
            <Sparkles size={16} className="text-dark-accent" />
            <span className="text-sm font-semibold text-dark-text-secondary">Features</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Everything you need to
            <br />
            <span className="bg-gradient-to-r from-dark-accent to-dark-accent-hover bg-clip-text text-transparent">
              land your dream job
            </span>
          </h2>
          <p className="text-xl text-dark-text-secondary max-w-2xl mx-auto">
            Powerful tools designed for modern job seekers and recruiters
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative ${feature.span} bg-dark-card/50 backdrop-blur-xl border border-dark-border rounded-3xl p-8 hover:border-dark-accent/30 transition-all overflow-hidden cursor-pointer`}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-dark-bg/50 backdrop-blur-xl border border-dark-border rounded-2xl mb-6 group-hover:scale-110 group-hover:border-dark-accent/50 transition-all">
                  <feature.icon size={28} className="text-dark-accent" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-dark-text-secondary group-hover:text-dark-text-primary transition-colors leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-dark-accent/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesBento
