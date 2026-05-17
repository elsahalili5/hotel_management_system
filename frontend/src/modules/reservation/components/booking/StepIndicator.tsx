const steps = ['Details', 'Summary', 'Payment']

export function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((label, i) => {
        const n = i + 1
        const done = current > n
        const active = current === n
        return (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-2 h-2 rounded-full transition-colors ${done || active ? 'bg-mansio-espresso' : 'bg-mansio-ink/20'}`} />
              <span className={`text-xs tracking-widest uppercase transition-colors ${active ? 'text-mansio-espresso' : 'text-mansio-mocha/40'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 h-px mx-3 mb-4 transition-colors ${done ? 'bg-mansio-espresso' : 'bg-mansio-ink/10'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}