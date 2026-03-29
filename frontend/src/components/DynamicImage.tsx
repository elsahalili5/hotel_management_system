import React from 'react'

interface DynamicImageProps {
  src: string
  alt?: string
  className?: string
  containerClassName?: string

  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

export const DynamicImage: React.FC<DynamicImageProps> = ({
  src,
  alt = 'Image content',
  className = '',
  containerClassName = '',
  objectFit = 'cover',
}) => {
  const FIXED_WIDTH = '100%'
  const FIXED_HEIGHT = '350px'

  return (
    <div
      className={`overflow-hidden ${containerClassName}`}
      style={{ width: FIXED_WIDTH, height: FIXED_HEIGHT }}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full ${className}`}
        style={{ objectFit }}
        loading="lazy"
      />
    </div>
  )
}
