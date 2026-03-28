interface TextSectionProps {
  subtitle?: string
  paragraphs: string[]
  themeColor?: string
}

export function TextSection({
  subtitle,
  paragraphs,
  themeColor = 'text-[#8b4513]',
}: TextSectionProps) {
  return (
    <section className="bg-[#fdf8f3] py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {subtitle && (
          <h2
            className={`font-serif text-4xl md:text-5xl mb-10 italic font-medium ${themeColor}`}
          >
            {subtitle}
          </h2>
        )}
        <div className="space-y-6 text-gray-700 font-light leading-relaxed text-lg md:text-xl">
          {paragraphs.map((p, index) => (
            <p key={index}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
