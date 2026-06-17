import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useThemeStore } from '../store/themeStore'
import { useAuthStore } from '../store/authStore'

const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore()
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' }
  ]

  const isLandingPage = location.pathname === '/'

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto bg-dark-card/50 backdrop-blur-2xl border border-dark-border rounded-2xl px-6 py-3 shadow-xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-dark-accent to-dark-accent-hover rounded-xl flex items-center justify-center shadow-glow-sm">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <span className="text-2xl font-bold text-white">
              ZenHire
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isLandingPage && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-dark-text-secondary hover:text-white transition-colors font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="hidden md:flex p-2.5 rounded-xl bg-dark-bg/50 hover:bg-dark-bg border border-dark-border hover:border-dark-accent/30 transition-all"
            >
              {theme === 'dark' ? (
                <Sun className="text-dark-accent" size={18} />
              ) : (
                <Moon className="text-dark-accent" size={18} />
              )}
            </motion.button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-xl font-semibold transition-all shadow-glow-sm"
                >
                  Dashboard
                </motion.button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden md:block">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 text-white hover:text-dark-accent transition-colors font-semibold"
                  >
                    Login
                  </motion.button>
                </Link>
                
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-xl font-semibold transition-all shadow-glow-sm"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && isLandingPage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pt-4 mt-4 border-t border-dark-border"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-dark-text-secondary hover:text-white transition-colors font-medium"
                >
                  {link.label}
                </a>
              ))}
              {!isAuthenticated && (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full text-left text-dark-text-secondary hover:text-white transition-colors font-medium">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
