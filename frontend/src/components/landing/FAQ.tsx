import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, Minus, Sparkles } from 'lucide-react'

const faqs = [
  {
    question: 'What is ZenHire?',
    answer: 'ZenHire is an AI-powered hiring platform that helps job seekers optimize their resumes, track applications, and land their dream jobs faster. For recruiters, it provides intelligent candidate matching and streamlined hiring workflows.'
  },
  {
    question: 'How does the AI resume analysis work?',
    answer: 'Our AI analyzes your resume against ATS (Applicant Tracking Systems) requirements, job descriptions, and industry standards. It provides actionable feedback on keywords, formatting, and content to maximize your chances of passing automated screening.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes! We use bank-level encryption and follow industry best practices for data security. Your personal information is never shared with third parties without your explicit consent. You maintain full control over your data at all times.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: "Absolutely. You can cancel your subscription at any time from your account settings. There are no cancellation fees, and you'll continue to have access until the end of your billing period."
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes! We offer a 14-day free trial of our Pro plan. No credit card required. You can explore all premium features and decide if ZenHire is right for you.'
  },
  {
    question: 'What makes ZenHire different from other job platforms?',
    answer: 'Unlike traditional job boards, ZenHire focuses on AI-powered optimization and tracking. We help you improve your application materials, match you with relevant opportunities, and provide real-time insights into your job search progress.'
  },
  {
    question: 'Is ZenHire suitable for recruiters?',
    answer: 'Yes! Our Enterprise plan includes a comprehensive recruiter dashboard with candidate management, team collaboration, advanced analytics, and custom integrations to streamline your hiring process.'
  },
  {
    question: 'How accurate is the ATS score?',
    answer: "Our ATS scoring system has 95% accuracy based on thousands of real job applications. It analyzes the same factors that actual ATS systems use, giving you reliable insights into your resume's compatibility."
  }
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
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
            <span className="text-sm font-semibold text-dark-text-secondary">FAQ</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Frequently asked
            <br />
            <span className="bg-gradient-to-r from-dark-accent to-dark-accent-hover bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <p className="text-xl text-dark-text-secondary">
            Everything you need to know about ZenHire
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full bg-dark-card/50 backdrop-blur-xl border border-dark-border hover:border-dark-accent/30 rounded-2xl p-6 transition-all text-left"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-bold text-white">
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 w-8 h-8 bg-dark-bg/50 rounded-xl flex items-center justify-center transition-all ${
                    openIndex === index ? 'bg-dark-accent' : ''
                  }`}>
                    {openIndex === index ? (
                      <Minus size={18} className="text-white" />
                    ) : (
                      <Plus size={18} className="text-dark-accent" />
                    )}
                  </div>
                </div>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-dark-text-secondary leading-relaxed mt-4 pr-8">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-dark-text-secondary mb-4">
            Still have questions?
          </p>
          <button className="text-dark-accent hover:text-dark-accent-hover font-semibold">
            Contact our support team →
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ
