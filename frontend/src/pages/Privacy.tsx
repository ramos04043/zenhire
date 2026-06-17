import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react'

const Privacy = () => {
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <Shield size={64} className="text-[#6366f1] mx-auto mb-4" />
            <h1 className="text-5xl font-black text-white mb-4">Privacy Policy</h1>
            <p className="text-gray-400">Last updated: January 2024</p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <section className="bg-[#111111] border border-gray-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
              <p className="text-gray-400 leading-relaxed">
                At ZenHire, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="bg-[#111111] border border-gray-800 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Database size={24} className="text-[#6366f1]" />
                <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
              </div>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Name, email address, and contact information</li>
                    <li>Resume and professional background</li>
                    <li>Job application history and preferences</li>
                    <li>Account credentials</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Usage Information</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Device information and IP address</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and actions taken</li>
                    <li>Time and date of visits</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="bg-[#111111] border border-gray-800 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck size={24} className="text-[#6366f1]" />
                <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
              </div>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full mt-2 flex-shrink-0"></div>
                  <span>To provide and maintain our services</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full mt-2 flex-shrink-0"></div>
                  <span>To match you with relevant job opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full mt-2 flex-shrink-0"></div>
                  <span>To analyze and optimize your resume</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full mt-2 flex-shrink-0"></div>
                  <span>To send you notifications and updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full mt-2 flex-shrink-0"></div>
                  <span>To improve our platform and user experience</span>
                </li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="bg-[#111111] border border-gray-800 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock size={24} className="text-[#6366f1]" />
                <h2 className="text-2xl font-bold text-white">Data Security</h2>
              </div>
              <p className="text-gray-400 leading-relaxed">
                We implement industry-standard security measures to protect your personal information. This includes encryption, secure servers, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Your Rights */}
            <section className="bg-[#111111] border border-gray-800 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Eye size={24} className="text-[#6366f1]" />
                <h2 className="text-2xl font-bold text-white">Your Rights</h2>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">You have the right to:</p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Access your personal information</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Request correction of inaccurate data</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Request deletion of your data</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Opt-out of marketing communications</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Export your data</span>
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section className="bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Questions About Privacy?</h2>
              <p className="text-gray-400 mb-6">Contact our privacy team for any concerns or inquiries.</p>
              <Link
                to="/contact"
                className="inline-block px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium"
              >
                Contact Us
              </Link>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Privacy
