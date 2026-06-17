import Navbar from '../components/Navbar'
import Hero from '../components/landing/Hero'
import TrustedCompanies from '../components/landing/TrustedCompanies'
import FeaturesBento from '../components/landing/FeaturesBento'
import AIWorkflow from '../components/landing/AIWorkflow'
import Statistics from '../components/landing/Statistics'
import Testimonials from '../components/landing/Testimonials'
import Pricing from '../components/landing/Pricing'
import FAQ from '../components/landing/FAQ'
import FinalCTA from '../components/landing/FinalCTA'
import Footer from '../components/landing/Footer'

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-dark-text-primary overflow-hidden">
      <Navbar />
      <Hero />
      <TrustedCompanies />
      <FeaturesBento />
      <AIWorkflow />
      <Statistics />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}

export default Landing
