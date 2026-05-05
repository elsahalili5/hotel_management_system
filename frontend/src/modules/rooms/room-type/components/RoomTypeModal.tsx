import { X, ImagePlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Modal } from '#/modules/admin/components/Modal'
import { Button } from '#/components/Button'
import { useAmenities } from '#/modules/rooms/amenity/hooks/use-amenities'
import { useBeds } from '#/modules/rooms/bed/hooks/use-beds'
import type { CreateRoomTypeInput, RoomTypeResponse } from '@mansio/shared'

type ImageEntry = { url: string; is_primary: boolean; alt_text: string }

interface Props {
  onClose: () => void
  onSubmit: (data: CreateRoomTypeInput) => Promise<void>
  defaultValues?: Partial<RoomTypeResponse>
  isPending?: boolean
  isError?: boolean
  title?: string
}

const field =
  'w-full border border-mansio-ink/10 rounded px-3 py-2 text-sm focus:outline-none'
const lbl = 'text-xs tracking-widest uppercase mb-1 block text-mansio-mocha'

export function RoomTypeModal({
  onClose,
  onSubmit,
  defaultValues,
  isPending,
  isError,
  title = 'Add Room Type',
}: Props) {
  const { data: amenities } = useAmenities()
  const { data: beds } = useBeds()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoomTypeInput>({
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          description: defaultValues.description ?? undefined,
          base_price: defaultValues.base_price
            ? Number(defaultValues.base_price)
            : undefined,
          max_occupancy: defaultValues.max_occupancy,
          size_m2: defaultValues.size_m2 ?? undefined,
        }
      : undefined,
  })

  const [selAmenities, setSelAmenities] = useState<number[]>(
    defaultValues?.amenities?.map((a) => a.amenity.id) ?? [],
  )
  const [bedQty, setBedQty] = useState<Record<number, number>>(
    Object.fromEntries(
      defaultValues?.beds?.map((b) => [b.bed.id, b.quantity]) ?? [],
    ),
  )
  const [images, setImages] = useState<ImageEntry[]>(
    defaultValues?.images?.map((img) => ({
      url: img.url,
      is_primary: img.is_primary,
      alt_text: img.alt_text ?? '',
    })) ?? [],
  )

  const toggleAmenity = (id: number) =>
    setSelAmenities((p) =>
      p.includes(id) ? p.filter((a) => a !== id) : [...p, id],
    )

  const updateImage = (i: number, patch: Partial<ImageEntry>) =>
    setImages((p) =>
      p.map((img, idx) => (idx === i ? { ...img, ...patch } : img)),
    )

  const handleFormSubmit = handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      amenities: selAmenities.length > 0 ? selAmenities : undefined,
      beds:
        Object.entries(bedQty)
          .filter(([, q]) => q > 0)
          .map(([id, quantity]) => ({ bed_id: Number(id), quantity })) ||
        undefined,
      images: images.filter((img) => img.url.trim()) || undefined,
    })
  })

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <div>
          <label className={lbl}>Name *</label>
          <input
            {...register('name', { required: true })}
            className={`${field} ${errors.name ? 'border-red-400' : ''}`}
            placeholder="e.g. Deluxe Suite"
          />
        </div>

        <div>
          <label className={lbl}>Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className={`${field} resize-none`}
            placeholder="Room description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Base Price (€) *</label>
            <input
              type="number"
              step="0.01"
              {...register('base_price', {
                required: true,
                valueAsNumber: true,
              })}
              className={`${field} ${errors.base_price ? 'border-red-400' : ''}`}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className={lbl}>Max Occupancy *</label>
            <input
              type="number"
              {...register('max_occupancy', {
                required: true,
                valueAsNumber: true,
              })}
              className={`${field} ${errors.max_occupancy ? 'border-red-400' : ''}`}
              placeholder="2"
            />
          </div>
        </div>

        <div>
          <label className={lbl}>Size (m²)</label>
          <input
            type="number"
            {...register('size_m2', { valueAsNumber: true })}
            className={field}
            placeholder="35"
          />
        </div>

        {amenities && amenities.length > 0 && (
          <div>
            <label className={lbl}>Amenities</label>
            <div className="border border-mansio-ink/10 rounded p-3 flex flex-wrap gap-2 max-h-36 overflow-y-auto">
              {amenities.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleAmenity(a.id)}
                  className={`px-3 py-1 rounded-full text-xs border border-mansio-ink/10 transition-colors ${selAmenities.includes(a.id) ? 'bg-mansio-espresso text-mansio-cream' : 'bg-mansio-cream text-mansio-mocha'}`}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {beds && beds.length > 0 && (
          <div>
            <label className={lbl}>Beds</label>
            <div className="border border-mansio-ink/10 rounded p-3 flex flex-col gap-2">
              {beds.map((b) => (
                <div key={b.id} className="flex items-center justify-between">
                  <span className="text-sm text-mansio-ink">
                    {b.name}{' '}
                    <span className="text-xs text-mansio-mocha">
                      ({b.capacity}p)
                    </span>
                  </span>
                  <input
                    type="number"
                    min={0}
                    defaultValue={bedQty[b.id] ?? 0}
                    onChange={(e) =>
                      setBedQty((p) => ({
                        ...p,
                        [b.id]: Number(e.target.value),
                      }))
                    }
                    className="w-16 border border-mansio-ink/10 rounded px-2 py-1 text-sm text-center focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={lbl}>Images</label>
            <button
              type="button"
              onClick={() =>
                setImages((p) => [
                  ...p,
                  { url: '', is_primary: p.length === 0, alt_text: '' },
                ])
              }
              className="flex items-center gap-1 text-xs text-mansio-mocha hover:opacity-70 transition-opacity"
            >
              <ImagePlus size={13} /> Add
            </button>
          </div>
          {images.length === 0 && (
            <p className="text-xs text-mansio-mocha py-1">No images added.</p>
          )}
          {images.map((img, i) => (
            <div
              key={i}
              className="border border-mansio-ink/10 rounded p-3 flex flex-col gap-2 mb-2"
            >
              <div className="flex gap-2">
                <input
                  value={img.url}
                  onChange={(e) => updateImage(i, { url: e.target.value })}
                  className={`${field} flex-1`}
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages((p) => p.filter((_, idx) => idx !== i))
                  }
                  className="text-red-400 hover:opacity-60 shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex gap-4">
                <input
                  value={img.alt_text}
                  onChange={(e) => updateImage(i, { alt_text: e.target.value })}
                  className={`${field} flex-1`}
                  placeholder="Alt text"
                />
                <label className="flex items-center gap-1.5 text-xs text-mansio-mocha shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={img.is_primary}
                    onChange={() =>
                      setImages((p) =>
                        p.map((im, idx) => ({ ...im, is_primary: idx === i })),
                      )
                    }
                  />{' '}
                  Primary
                </label>
              </div>
            </div>
          ))}
        </div>

        {isError && (
          <p className="text-xs text-red-500">
            Something went wrong. Please try again.
          </p>
        )}

        <div className="flex justify-end gap-3 mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
