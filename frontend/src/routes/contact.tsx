import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '../components/HeroSection'
import { ContactItem } from '../components/ContactItem'
import { PhoneCall, Send, Headset } from 'lucide-react'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Banneri kryesor */}
      <HeroSection
        height="500px"
        title="CONTACT"
        image="https://epidamn.com/assets/images/pamjedhoma.jpg"
      />

      {/* Seksioni i kartave të kontaktit */}
      <section className="bg-white py-16  ">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-mansio-gold/20">
            <ContactItem
              icon={<PhoneCall size={32} strokeWidth={1.2} />}
              title="Make a Call"
              description="Make a call for your general enquiries."
              value="815-641-5000"
              href="tel:815-641-5000"
            />

            <ContactItem
              icon={<Send size={32} strokeWidth={1.2} />}
              title="Send a Mail"
              description="Send your mail for general enquiries."
              value="info@mansio.com"
              href="mailto:info@mansio.com"
            />

            <ContactItem
              icon={<Headset size={32} strokeWidth={1.2} />}
              title="Toll Free"
              description="Toll free number for staying guests."
              value="1800-641-1234"
              href="tel:1800-641-1234"
            />
          </div>
        </div>
      </section>

      <section className="w-full h-[450px] mb-16 bg-mansio-ivory grayscale hover:grayscale-0 transition-all duration-700 ease-in-out">
        <iframe
          title="Mansio Hotel"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2938.167265842886!2d21.12154217658934!3d42.57303022131976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13549d0046b08051%3A0x6b3b516f4d2a933!2sUBT%20Innovative%20Campus!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </main>
  )
}
