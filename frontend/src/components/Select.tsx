import type { ComponentProps } from 'react'
import { fieldClass } from './Input'

interface SelectProps extends ComponentProps<'select'> {
  error?: boolean
}

export function Select({ className, error, ...props }: SelectProps) {
  return (
    <select
      className={[fieldClass, error ? 'border-red-400' : '', className ?? ''].filter(Boolean).join(' ')}
      {...props}
    />
  )
}