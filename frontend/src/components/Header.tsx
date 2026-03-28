import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { Container } from './Container'
import { Button } from './Button'

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
      <header className="sticky top-0 z-50 backdrop-blur-md font-light bg-mansio-cream">
        <Container className="relative py-3">
          <div className="flex items-center h-16 border-t border-b border-mansio-espresso">

            {/* Logo */}
            <Link to="/" className="flex items-center no-underline flex-shrink-0">
              <Logo size={120} />
            </Link>

            {/* Nav Links - desktop */}
            <nav className="hidden md:flex items-center gap-5 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm text-mansio-taupe no-underline transition-colors duration-200 whitespace-nowrap"
                  activeProps={{ className: 'text-mansio-espresso font-semibold' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="ml-auto flex items-center gap-3">
              <Button to="/contact" className="hidden md:inline-flex">
                BOOK NOW
              </Button>
              <button
                className="md:hidden p-2 rounded-md text-mansio-espresso transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </Container>
      </header>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 z-[60] flex flex-col px-8 py-10 gap-6 bg-mansio-cream transition-all duration-500 ease-in-out ${
          menuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <Logo size={120} />
          </Link>
          <button onClick={() => setMenuOpen(false)} className="text-mansio-espresso" aria-label="Close menu">
            <X size={28} />
          </button>
        </div>

        <div className="h-px w-full bg-mansio-espresso" />

        {/* Links */}
        <nav className="flex flex-col gap-6 mt-4">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-2xl font-medium no-underline text-mansio-taupe"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`,
              }}
              activeProps={{ className: 'text-mansio-espresso font-semibold' }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="h-px w-full mt-auto bg-mansio-espresso" />

        <Button to="/contact" className="self-start" onClick={() => setMenuOpen(false)}>
          BOOK NOW
        </Button>
      </div>
    </>
  )
}
