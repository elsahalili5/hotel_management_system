import { Plus, Minus } from 'lucide-react'

interface AccordionItemProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onClick: () => void
}

export function AccordionItem({
  title,
  children,
  isOpen,
  onClick,
}: AccordionItemProps) {
  return (
    <div className="rounded-4xl border  text-mansio-espresso border-mansio-gold overflow-hidden transition-colors duration-300">
      <button
        className="w-full flex items-center justify-between px-4 md:px-8 py-4 md:py-6 text-left hover:bg-mansio-cream transition-colors"
        onClick={onClick}
      >
        <span className="font-serif text-base md:text-xl tracking-wide">{title}</span>
        <span className="text-mansio-espresso transition-transform duration-300 flex-shrink-0">
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-250 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 md:px-8 pb-6 md:pb-10 pt-2 border-t border-(--line)">
          {children}
        </div>
      </div>
    </div>
  )
}
