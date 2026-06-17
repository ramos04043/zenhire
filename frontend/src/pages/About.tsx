import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Target, Users, TrendingUp, Heart, Shield, ArrowRight } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#6366f1] rounded flex items-center justify-center">
                <Zap className="text-white" size={20} strokeWidth={3} />
              </div>
              <span className="text-xl font-black text-white uppercase tracking-tighter">ZenHire</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              <Link to="/login" className="px-4 py-2 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-black text-white mb-6">
              Building the Future of <span className="text-[#6366f1]">Job Search</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              ZenHire is transforming how job seekers find their dream careers through AI-powered matching,
              intelligent resume optimization, and comprehensive application tracking.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#111111] border border-gray-800 rounded-xl p-8"
            >
              <div className="w-14 h-14 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-lg flex items-center justify-center mb-4">
                <Target size={28} className="text-[#6366f1]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed">
                Empower every job seeker with AI-driven tools to land their dream job faster and more efficiently.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#111111] border border-gray-800 rounded-xl p-8"
            >
              <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Users size={28} className="text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Team</h3>
              <p className="text-gray-400 leading-relaxed">
                Built by a team of engineers, recruiters, and career coaches who understand the job search journey.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#111111] border border-gray-800 rounded-xl p-8"
            >
              <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp size={28} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Impact</h3>
              <p className="text-gray-400 leading-relaxed">
                Helping thousands of job seekers get hired faster with better matches and higher success rates.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-black text-white mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Heart, title: 'User-Centric', desc: 'Every feature is designed with job seekers in mind' },
              { icon: Shield, title: 'Privacy First', desc: 'Your data is secure and never shared without permission' },
              { icon: Zap, title: 'Innovation', desc: 'Continuously improving with AI and automation' },
              { icon: Users, title: 'Community', desc: 'Building a supportive ecosystem for job seekers' }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-6 bg-[#111111] border border-gray-800 rounded-xl"
              >
                <div className="p-3 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-lg">
                  <value.icon size={24} className="text-[#6366f1]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-400">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-black text-white mb-6">Ready to Transform Your Job Search?</h2>
          <p className="text-xl text-gray-400 mb-8">Join thousands of job seekers who are landing their dream jobs faster.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-bold text-lg"
          >
            Get Started Free
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About
