import type { ReactNode } from 'react'

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
  className?: string
  variant?: 'primary' | 'outline'
  endIcon?: ReactNode
  startIcon?: ReactNode
  onClick?: () => void
}

export function Button({
  children,
  onClick,
  className = '',
  variant = 'primary',
  endIcon,
  startIcon,
}: ButtonProps) {
  const style = variants[variant]

  return (
    <button onClick={onClick} className={`${base} ${className}`} style={style}>
      {startIcon}
      {children}
      {endIcon}
    </button>
  )
}
