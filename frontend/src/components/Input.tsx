import type { ComponentProps } from 'react'

export const fieldClass = 'w-full border border-mansio-ink/10 rounded px-3 py-2 text-sm focus:outline-none'

const base = fieldClass

interface InputProps extends ComponentProps<'input'> {
  error?: boolean
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={[base, error ? 'border-red-400' : '', className ?? ''].filter(Boolean).join(' ')}
      {...props}
    />
  )
}

interface SelectProps extends ComponentProps<'select'> {
  error?: boolean
}

export function Select({ className, error, ...props }: SelectProps) {
  return (
    <select
      className={[base, error ? 'border-red-400' : '', className ?? ''].filter(Boolean).join(' ')}
      {...props}
    />
  )
}
