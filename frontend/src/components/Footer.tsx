import { Twitter, Facebook, Instagram, Phone } from 'lucide-react'
import { Container } from './Container'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-mansio-espresso py-4 text-mansio-linen">
      <Container className="relative py-1">
        <div className="mx-auto ">
          <div className="border-t border-mansio-mocha opacity-50 mb-5"></div>

          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm font-light tracking-widest uppercase">
              Copyright © {year} MANSIO RESORT. All Rights Reserved.
            </p>

            <div className="flex items-center gap-4">
              <SocialIcon
                href="#"
                icon={<Twitter size={16} strokeWidth={1.5} />}
                label="X"
              />
              <SocialIcon
                href="#"
                icon={<Facebook size={16} strokeWidth={1.5} />}
                label="Facebook"
              />
              <SocialIcon
                href="#"
                icon={<Instagram size={16} strokeWidth={1.5} />}
                label="Instagram"
              />
              <SocialIcon
                href="#"
                icon={<Phone size={16} strokeWidth={1.5} />}
                label="WhatsApp"
              />
            </div>
          </div>

          <div className="border-b border-mansio-mocha opacity-50 mt-5"></div>
        </div>
      </Container>
    </footer>
  )
}

function SocialIcon({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-mansio-mocha text-mansio-linen transition-all duration-300 hover:bg-[#d1ccc0] hover:text-[#4a443e] hover:border-[#d1ccc0]"
    >
      {icon}
    </a>
  )
}
