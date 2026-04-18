interface RoomGalleryProps {
  images: string[]
  roomName: string
}

export function RoomGallery({ images, roomName }: RoomGalleryProps) {
  return (
    <div>
      <p className="text-xs tracking-widest uppercase mb-6 text-mansio-gold">Gallery</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <div key={i} className="overflow-hidden aspect-[4/3]">
            <img
              src={img}
              alt={`${roomName} view ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
