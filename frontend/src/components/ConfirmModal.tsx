import { Modal } from './Modal'
import { Button } from '#/components/Button'

interface ConfirmModalProps {
  message: string
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmModal({
  message,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal title="Confirm" onClose={onClose} maxWidth="max-w-sm">
      <p className="text-sm text-mansio-mocha mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Delete</Button>
      </div>
    </Modal>
  )
}
