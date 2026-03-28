import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

const variants = {
  primary: {
    backgroundColor: 'var(--color-mansio-espresso)',
    color: 'var(--color-mansio-cream)',
    border: 'none',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--color-mansio-espresso)',
    border: '1px solid var(--color-mansio-espresso)',
  },
}

const base =
  'inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium no-underline transition-opacity duration-200 hover:opacity-80 cursor-pointer'

interface ButtonProps {
  children: ReactNode
  to?: string
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'outline'
}

export function Button({ children, to, onClick, className = '', variant = 'primary' }: ButtonProps) {
  const style = variants[variant]

  if (to) {
    return (
      <Link to={to} className={`${base} ${className}`} style={style} onClick={onClick}>
        {children} <span aria-hidden>→</span>
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={`${base} ${className}`} style={style}>
      {children} <span aria-hidden>→</span>
    </button>
  )
}
