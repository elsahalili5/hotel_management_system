import type { ComponentProps } from 'react'

export const fieldClass = 'w-full border border-mansio-ink/10 rounded px-3 py-2 text-sm focus:outline-none'
export const labelClass = 'text-xs tracking-widest uppercase mb-1 block text-mansio-mocha'

interface InputProps extends ComponentProps<'input'> {
  error?: boolean
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={[fieldClass, error ? 'border-red-400' : '', className ?? ''].filter(Boolean).join(' ')}
      {...props}
    />
  )
}