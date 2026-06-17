import { motion } from 'framer-motion'
import { Star, Sparkles } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    company: 'Google',
    image: '👩‍💼',
    rating: 5,
    text: 'ZenHire helped me land my dream job at Google. The AI resume optimizer was a game-changer. I went from 2% to 96% ATS score!'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Engineering Manager',
    company: 'Microsoft',
    image: '👨‍💻',
    rating: 5,
    text: 'The interview prep feature saved me countless hours. I had everything I needed organized in one place. Highly recommend!'
  },
  {
    name: 'Emily Watson',
    role: 'Data Scientist',
    company: 'Meta',
    image: '👩‍🔬',
    rating: 5,
    text: 'Best investment in my career. The real-time tracking helped me stay organized across 50+ applications. Worth every penny.'
  },
  {
    name: 'David Kim',
    role: 'UX Researcher',
    company: 'Apple',
    image: '👨‍🎨',
    rating: 5,
    text: "The AI matching is incredibly accurate. I only got relevant job recommendations that matched my skills and experience."
  },
  {
    name: 'Lisa Johnson',
    role: 'Product Manager',
    company: 'Amazon',
    image: '👩‍💼',
    rating: 5,
    text: 'As a recruiter, ZenHire has transformed how I manage candidates. The dashboard is intuitive and saves hours every week.'
  },
  {
    name: 'James Park',
    role: 'Software Engineer',
    company: 'Netflix',
    image: '👨‍💻',
    rating: 5,
    text: 'Went from 6 months of job searching to 3 job offers in 4 weeks. The platform is exceptional and the AI insights are spot-on.'
  }
]

const Testimonials = () => {
  return (
    <section className="py-32 px-6 border-t border-dark-border">
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
            <span className="text-sm font-semibold text-dark-text-secondary">Testimonials</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Loved by job seekers
            <br />
            <span className="bg-gradient-to-r from-dark-accent to-dark-accent-hover bg-clip-text text-transparent">
              and recruiters alike
            </span>
          </h2>
          <p className="text-xl text-dark-text-secondary max-w-2xl mx-auto">
            See what our users have to say about their experience
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-dark-card/50 backdrop-blur-xl border border-dark-border rounded-3xl p-8 hover:border-dark-accent/30 transition-all"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-dark-accent text-dark-accent" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-dark-text-primary text-lg mb-8 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-dark-bg rounded-full flex items-center justify-center text-2xl border border-dark-border group-hover:border-dark-accent/30 transition-all">
                  {testimonial.image}
                </div>
                <div>
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-sm text-dark-text-secondary">
                    {testimonial.role} at {testimonial.company}
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

export default Testimonials
