import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-[#6366f1] hover:text-[#5558e3] mb-8">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#6366f1]/10 rounded-lg flex items-center justify-center">
            <FileText className="text-[#6366f1]" size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
            <p className="text-gray-400 mt-1">Last updated: February 1, 2024</p>
          </div>
        </div>

        <div className="bg-[#111111] border border-gray-800 rounded-lg p-8">
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-400 leading-relaxed">
                By accessing and using ZenHire, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">2. Use of Service</h2>
              <p className="text-gray-400 leading-relaxed mb-3">
                ZenHire provides an AI-powered job search and resume optimization platform. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Not misuse or abuse the service</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">3. User Accounts</h2>
              <p className="text-gray-400 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities 
                that occur under your account. You must notify us immediately of any unauthorized use.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">4. Intellectual Property</h2>
              <p className="text-gray-400 leading-relaxed">
                All content, features, and functionality of ZenHire are owned by us and are protected by international 
                copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">5. Privacy</h2>
              <p className="text-gray-400 leading-relaxed">
                Your use of ZenHire is also governed by our Privacy Policy. Please review our Privacy Policy to understand 
                our practices regarding your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">6. Termination</h2>
              <p className="text-gray-400 leading-relaxed">
                We reserve the right to terminate or suspend your account and access to the service at our sole discretion, 
                without notice, for conduct that we believe violates these Terms or is harmful to other users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">7. Limitation of Liability</h2>
              <p className="text-gray-400 leading-relaxed">
                ZenHire is provided "as is" without any warranties. We shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">8. Changes to Terms</h2>
              <p className="text-gray-400 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any material changes. 
                Your continued use of the service after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">9. Contact Us</h2>
              <p className="text-gray-400 leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="text-[#6366f1] mt-2">legal@zenhire.com</p>
            </section>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link to="/privacy">
            <button className="px-6 py-3 bg-[#111111] hover:bg-[#1a1a1a] border border-gray-800 text-white rounded-lg transition-colors">
              Privacy Policy
            </button>
          </Link>
          <Link to="/contact">
            <button className="px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Terms
