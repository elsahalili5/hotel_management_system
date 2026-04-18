import { useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from './Button'
import { Container } from './Container'

/* ── Field definitions ───────────────────────────────────────────────── */

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'select'
  | 'textarea'

export interface SelectOption {
  value: string
  label: string
}

export interface FieldDef {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  options?: SelectOption[] // only for type="select"
  rows?: number // only for type="textarea"
  colSpan?: 'half' | 'full' // default: "half"
}

export interface FormSectionProps {
  title?: string
  subtitle?: string
  fields: FieldDef[]
  submitLabel?: string
  submitIcon?: ReactNode
  successTitle?: string
  successMessage?: string
  onSubmit?: (values: Record<string, string>) => Promise<void> | void
  background?: 'cream' | 'white' | 'ivory'
  card?: boolean
  inline?: boolean
  footer?: ReactNode
}

const bgMap = {
  cream: 'bg-mansio-cream',
  white: 'bg-white',
  ivory: 'bg-mansio-ivory',
}

export function FormSection({
  title,
  subtitle,
  fields,
  submitLabel = 'Submit',
  submitIcon,
  successTitle = 'Thank You',
  successMessage = 'Your request has been received. We will be in touch shortly.',
  onSubmit,
  background = 'cream',
  card = false,
  inline = false,
  footer,
}: FormSectionProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, ''])),
  )
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit?.(values)
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setValues(Object.fromEntries(fields.map((f) => [f.name, ''])))
    setSubmitted(false)
  }

  const inner = (
    <>
      {/* Header */}
      {(title || subtitle) && (
        <div className={`text-center ${card ? 'mb-8' : 'mb-10'}`}>
          {title && (
            <h2
              className={`font-serif font-normal text-mansio-espresso leading-tight mb-4 ${card ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'}`}
            >
              {title}
            </h2>
          )}
          <div className="h-px w-12 bg-mansio-gold mx-auto mb-4" />
          {subtitle && (
            <p className="text-mansio-mocha text-sm leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Success state */}
      {submitted ? (
        <div className="text-center py-10 space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-mansio-gold/50 text-mansio-gold">
            <CheckIcon />
          </div>
          <h3 className="font-serif text-2xl text-mansio-espresso">
            {successTitle}
          </h3>
          <p className="text-mansio-mocha text-sm leading-relaxed max-w-sm mx-auto">
            {successMessage}
          </p>
          <button
            onClick={reset}
            className="mt-2 text-xs text-mansio-taupe underline underline-offset-4 hover:text-mansio-mocha transition-colors"
          >
            Submit another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fields.map((field) => (
              <div
                key={field.name}
                className={
                  field.colSpan === 'full' || field.type === 'textarea'
                    ? 'sm:col-span-2'
                    : ''
                }
              >
                <FieldRenderer
                  field={field}
                  value={values[field.name]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <div
            className={`pt-4 flex justify-center ${card ? 'mt-2 border-t border-mansio-linen/40' : ''}`}
          >
            <Button
              type="submit"
              disabled={loading}
              endIcon={loading ? <SpinnerIcon /> : submitIcon}
            >
              {loading ? 'Sending…' : submitLabel}
            </Button>
          </div>
        </form>
      )}
    </>
  )

  if (inline) {
    return (
      <>
        {inner}
        {footer}
      </>
    )
  }

  if (card) {
    return (
      <section
        className={`${bgMap[background]} min-h-screen flex items-center justify-center px-4 py-16`}
      >
        <div className="w-full max-w-md bg-white border border-mansio-linen/50 rounded-xl shadow-sm shadow-mansio-linen/40 px-8 py-10">
          {inner}
          {footer}
        </div>
      </section>
    )
  }

  return (
    <section className={`${bgMap[background]} py-16 md:py-24`}>
      <Container>
        <div className="max-w-2xl mx-auto">{inner}</div>
      </Container>
    </section>
  )
}

/* ── Field renderer ──────────────────────────────────────────────────── */

interface FieldRendererProps {
  field: FieldDef
  value: string
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void
}

const inputClass =
  'w-full bg-white border border-mansio-linen/60 rounded-sm px-4 py-3 text-sm text-mansio-espresso placeholder-mansio-linen focus:outline-none focus:border-mansio-gold transition-colors'

function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium tracking-widest uppercase text-mansio-taupe">
        {field.label}
      </label>

      {field.type === 'textarea' ? (
        <textarea
          name={field.name}
          placeholder={field.placeholder}
          value={value}
          onChange={onChange}
          required={field.required}
          rows={field.rows ?? 5}
          className={`${inputClass} resize-none`}
        />
      ) : field.type === 'select' ? (
        <select
          name={field.name}
          value={value}
          onChange={onChange}
          required={field.required}
          className={inputClass}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239c8d7a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 14px center',
            appearance: 'none',
          }}
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value} disabled={o.value === ''}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          name={field.name}
          placeholder={field.placeholder}
          value={value}
          onChange={onChange}
          required={field.required}
          className={inputClass}
        />
      )}
    </div>
  )
}

function SpinnerIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
