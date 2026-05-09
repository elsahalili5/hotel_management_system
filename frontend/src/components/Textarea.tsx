import type { ComponentProps } from 'react'
import { fieldClass } from './Input'

interface TextareaProps extends ComponentProps<'textarea'> {
  error?: boolean
}

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      className={[fieldClass, 'resize-none', error ? 'border-red-400' : '', className ?? ''].filter(Boolean).join(' ')}
      {...props}
    />
  )
}