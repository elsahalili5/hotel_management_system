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
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-mansio-espresso)',
    border: 'none',
  },
}

const base =
  'inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium no-underline transition-opacity duration-200 hover:opacity-80 cursor-pointer'

const iconBase =
  'inline-flex items-center justify-center rounded-full p-2 transition-opacity duration-200 hover:opacity-80 cursor-pointer'

interface ButtonProps {
  children: ReactNode
  className?: string
  color?: string
  variant?: 'primary' | 'outline' | 'ghost'
  endIcon?: ReactNode
  startIcon?: ReactNode
  isIcon?: boolean
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  'aria-label'?: string
}

export function Button({
  children,
  onClick,
  className = '',
  color,
  variant = 'primary',
  endIcon,
  startIcon,
  isIcon = false,
  type = 'button',
  disabled = false,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const variantStyle = variants[variant]
  const cls = isIcon ? `${iconBase} ${className}` : `${base} ${className}`

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={cls}
      style={{ ...variantStyle, ...(color && { color }) }}
      aria-label={ariaLabel}
    >
      {!isIcon && startIcon}
      {children}
      {!isIcon && endIcon}
    </button>
  )
}
