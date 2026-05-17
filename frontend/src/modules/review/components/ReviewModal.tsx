import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { reviewApi } from '../api/review-api'
import { X } from 'lucide-react'

interface ReviewModalProps {
  reservationId: number
  roomNumber: string
  onClose: () => void
  onSuccess: () => void
}

export function ReviewModal({
  reservationId,
  roomNumber,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: reviewApi.create,
    onSuccess: () => {
      onSuccess()
      onClose()
    },
  })

  const handleSubmit = () => {
    if (rating === 0) return
    mutate({
      reservation_id: reservationId,
      rating,
      comment: comment || undefined,
    })
  }

  const errorMsg = isError
    ? ((error as any)?.message ?? 'Failed to submit review')
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-mansio-taupe hover:opacity-70 transition-opacity"
        >
          <X size={18} />
        </button>

        <p className="text-xs tracking-widest uppercase text-mansio-gold mb-1">
          Rate your stay
        </p>
        <h2 className="font-serif text-2xl text-mansio-espresso mb-6">
          Room #{roomNumber}
        </h2>

        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              // nese klikon 3 set rating 3
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="text-3xl transition-colors"
            >
              <span
                className={
                  (hovered || rating) >= star
                    ? 'text-mansio-gold'
                    : 'text-mansio-gold/25'
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (optional)"
          rows={4}
          className="w-full border border-mansio-ink/10 rounded p-3 text-sm text-mansio-espresso placeholder:text-mansio-taupe resize-none focus:outline-none focus:border-mansio-gold/50 mb-4"
        />

        {errorMsg && <p className="text-xs text-red-500 mb-3">{errorMsg}</p>}

        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isPending}
          className="w-full py-3 text-xs tracking-widest uppercase bg-mansio-espresso text-mansio-cream font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
        >
          {isPending ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  )
}
