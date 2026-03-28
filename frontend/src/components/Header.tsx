import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { Container } from './Container'

const navLinks = [
  { label: 'ABOUT', to: '/about' },
  { label: 'ROOMS', to: '/rooms' },
  { label: 'RESTAURANTS', to: '/restaurant' },
  { label: 'SPA & SPORTS', to: '/spa' },
  { label: 'CONTACT', to: '/contact' },
] as const

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ backgroundColor: 'var(--color-mansio-cream)' }}
      >
        <Container className="relative py-3">
          <div
            className="flex items-center h-16"
            style={{
              borderTop: '1px solid var(--color-mansio-espresso)',
              borderBottom: '1px solid var(--color-mansio-espresso)',
            }}
          >
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center no-underline flex-shrink-0"
            >
              <Logo size={120} />
            </Link>

            {/* Nav Links - desktop */}
            <nav className="hidden md:flex items-center gap-5 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm no-underline transition-colors duration-200 whitespace-nowrap"
                  style={{ color: 'var(--color-mansio-taupe)' }}
                  activeProps={{
                    style: {
                      color: 'var(--color-mansio-espresso)',
                      fontWeight: 600,
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="ml-auto flex items-center gap-3">
              <Link
                to="/contact"
                className="hidden md:inline-flex rounded-full px-5 py-2 text-sm font-medium no-underline transition-opacity duration-200 hover:opacity-80"
                style={{
                  backgroundColor: 'var(--color-mansio-espresso)',
                  color: 'var(--color-mansio-cream)',
                }}
              >
                BOOK NOW →
              </Link>

              <button
                className="md:hidden p-2 rounded-md transition-colors"
                style={{ color: 'var(--color-mansio-espresso)' }}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile menu - jashtë header-it */}
      <div
        className={`md:hidden fixed inset-0 z-[60] flex flex-col px-8 py-10 gap-6 transition-all duration-500 ease-in-out ${
          menuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{ backgroundColor: '#F7F2EA' }}
      >
        {/* Top row: logo + close */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <Logo size={120} />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ color: 'var(--color-mansio-espresso)' }}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full"
          style={{ backgroundColor: 'var(--color-mansio-espresso)' }}
        />

        {/* Links */}
        <nav className="flex flex-col gap-6 mt-4">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-2xl font-medium no-underline"
              style={{
                color: 'var(--color-mansio-taupe)',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`,
              }}
              activeProps={{
                style: {
                  color: 'var(--color-mansio-espresso)',
                  fontWeight: 600,
                },
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div
          className="h-px w-full mt-auto"
          style={{ backgroundColor: 'var(--color-mansio-espresso)' }}
        />

        {/* Book Now */}
        <Link
          to="/contact"
          className="self-start rounded-full px-6 py-3 text-sm font-medium no-underline transition-opacity duration-200 hover:opacity-80"
          style={{
            backgroundColor: 'var(--color-mansio-espresso)',
            color: 'var(--color-mansio-cream)',
          }}
          onClick={() => setMenuOpen(false)}
        >
          BOOK NOW →
        </Link>
      </div>
    </>
  )
}
