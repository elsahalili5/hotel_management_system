import { X } from 'lucide-react'
import { Button } from '#/components/Button'

interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
  maxWidth?: string
}

export function Modal({
  title,
  onClose,
  children,
  maxWidth = 'max-w-lg',
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={`w-full ${maxWidth} rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto bg-mansio-cream`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-lg text-mansio-ink">{title}</h2>
          <Button isIcon variant="ghost" aria-label="Close" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
