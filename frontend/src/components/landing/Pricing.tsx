import { motion } from 'framer-motion'
import { Check, Sparkles, ArrowRight, Crown } from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Up to 10 applications',
      'Basic ATS score',
      'Resume analysis',
      'Email notifications',
      'Community support'
    ],
    cta: 'Get Started',
    highlighted: false
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'Best for active job seekers',
    features: [
      'Unlimited applications',
      'Advanced ATS optimization',
      'AI resume builder',
      'Interview preparation',
      'Priority support',
      'Analytics dashboard',
      'Smart job matching',
      'Custom cover letters'
    ],
    cta: 'Start Free Trial',
    highlighted: true,
    badge: 'Most Popular'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For recruiters and teams',
    features: [
      'Everything in Pro',
      'Recruiter dashboard',
      'Team collaboration',
      'Advanced analytics',
      'Custom integrations',
      'Dedicated support',
      'API access',
      'White-label options'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
]

const Pricing = () => {
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
            <span className="text-sm font-semibold text-dark-text-secondary">Pricing</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Choose your plan.
            <br />
            <span className="bg-gradient-to-r from-dark-accent to-dark-accent-hover bg-clip-text text-transparent">
              Start for free.
            </span>
          </h2>
          <p className="text-xl text-dark-text-secondary max-w-2xl mx-auto">
            No credit card required. Upgrade anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${
                plan.highlighted 
                  ? 'lg:scale-105 lg:shadow-glow' 
                  : ''
              }`}
            >
              <div className={`relative bg-dark-card/50 backdrop-blur-xl border rounded-3xl p-8 h-full flex flex-col ${
                plan.highlighted 
                  ? 'border-dark-accent' 
                  : 'border-dark-border hover:border-dark-accent/30'
              } transition-all`}>
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-dark-accent text-white text-sm font-bold rounded-full flex items-center gap-2">
                    <Crown size={14} />
                    {plan.badge}
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-dark-text-secondary mb-6">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-dark-text-secondary">/ {plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check size={20} className="text-dark-accent flex-shrink-0 mt-0.5" />
                      <span className="text-dark-text-primary">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link to="/register" className="block">
                  <button className={`w-full py-4 rounded-2xl font-semibold transition-all inline-flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? 'bg-dark-accent hover:bg-dark-accent-hover text-white shadow-glow-sm hover:scale-105'
                      : 'bg-dark-bg/50 border border-dark-border hover:border-dark-accent/50 text-white hover:bg-dark-bg'
                  }`}>
                    {plan.cta}
                    <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-dark-text-secondary">
            All plans include a 14-day money-back guarantee. No questions asked.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
