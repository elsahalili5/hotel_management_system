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
    <div className="rounded-4xl border  text-mansio-espresso border-mansio-gold overflow-hidden bg-mansio-cream transition-colors duration-300">
      <button
        className="w-full flex items-center justify-between px-8 py-6 text-left hover:bg-mansio-ivory  transition-colors"
        onClick={onClick}
      >
        <span className="font-serif text-2xl tracking-wide">{title}</span>
        <span className=" text-mansio-espresso transition-transform duration-300">
          {isOpen ? <Minus size={22} /> : <Plus size={22} />}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-250 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-8 pb-10 pt-2 border-t border-(--line) ">
          {children}
        </div>
      </div>
    </div>
  )
}
