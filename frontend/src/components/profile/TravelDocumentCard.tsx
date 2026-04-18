import { FileText } from 'lucide-react'

interface TravelDocumentCardProps {
  passportNumber?: string
}

export function TravelDocumentCard({ passportNumber }: TravelDocumentCardProps) {
  return (
    <div className="bg-mansio-ivory p-8">
      <div className="mb-6">
        <p className="text-xs tracking-widest uppercase mb-1 text-mansio-gold">Document</p>
        <h2 className="font-serif text-2xl text-mansio-espresso">Travel Document</h2>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FileText size={12} className="text-mansio-gold" />
          <span className="text-xs tracking-widest uppercase text-mansio-taupe">Passport Number</span>
        </div>
        <p className="text-sm font-medium text-mansio-espresso pl-5 tracking-widest">
          {passportNumber ?? <span className="text-mansio-taupe font-light italic">Not provided</span>}
        </p>
      </div>
    </div>
  )
}
