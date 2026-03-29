import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Menu, X } from 'lucide-react'
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

           
            <Link to="/" className="flex items-center no-underline flex-shrink-0">
              <Logo size={120} />
            </Link>

           
            <nav className="hidden lg:flex items-center gap-5 absolute left-1/2 -translate-x-1/2">
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

           
            <div className="ml-auto flex items-center gap-3">
              <Link to="/contact" className="hidden lg:inline-flex no-underline">
                <Button endIcon={<ArrowRight size={16} />}>BOOK NOW</Button>
              </Link>

              <Button
                isIcon
                variant="ghost"
                className="lg:hidden"
                aria-label="Toggle menu"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>

          </div>
        </Container>
      </header>

     
      <div
        className={`lg:hidden fixed inset-0 z-[60] flex flex-col px-8 py-10 gap-6 bg-mansio-cream transition-all duration-500 ease-in-out ${
          menuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
       
        <div className="flex items-center justify-between mb-4">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <Logo size={120} />
          </Link>
          <Button isIcon variant="ghost" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <X size={22} />
          </Button>
        </div>

        <div className="h-px w-full bg-mansio-espresso" />

        <nav className="flex flex-col items-center justify-center gap-6 flex-1">
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

        <div className="h-px w-full bg-mansio-espresso" />

        <div className="flex justify-center">
          <Link to="/contact" className="no-underline" onClick={() => setMenuOpen(false)}>
            <Button endIcon={<ArrowRight size={16} />}>BOOK NOW</Button>
          </Link>
        </div>
      </div>
    </>
  )
}
