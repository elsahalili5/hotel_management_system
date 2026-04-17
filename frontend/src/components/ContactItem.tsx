import React from 'react'

interface ContactItemProps {
  icon: React.ReactNode
  title: string
  description: string
  value: string
  href?: string
}

export const ContactItem: React.FC<ContactItemProps> = ({
  icon,
  title,
  description,
  value,
  href,
}) => {
  return (
    <div className="flex flex-col items-center text-center p-8 group">
      <div className="mb-4 text-mansio-gold transform transition-transform group-hover:scale-110 duration-300">
        {icon}
      </div>

      <h3 className="font-serif text-2xl text-mansio-espresso mb-2">{title}</h3>

      <p className="text-sm text-mansio-mocha font-light mb-4 max-w-50 leading-relaxed">
        {description}
      </p>

      {href ? (
        <a
          href={href}
          className="text-mansio-gold font-medium tracking-wide hover:text-mansio-espresso transition-colors"
        >
          {value}
        </a>
      ) : (
        <span className="text-mansio-gold font-medium tracking-wide">
          {value}
        </span>
      )}
    </div>
  )
}
