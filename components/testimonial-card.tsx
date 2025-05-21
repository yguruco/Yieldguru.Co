import { Card, CardContent } from "@/components/ui/card"

interface TestimonialCardProps {
  quote: string
  author: string
  title: string
  originalIndex?: number
  glassmorphic?: boolean
  compact?: boolean
}

export default function TestimonialCard({ quote, author, title, glassmorphic = false, compact = false }: TestimonialCardProps) {
  return (
    <Card className={`aspect-square h-full ${glassmorphic ? 'bg-white/10 backdrop-blur-sm' : 'bg-white/5'} border border-white/20`}>
      <CardContent className="p-4 flex flex-col h-full">
        <div className="mb-3 text-[#fbdc3e]">
          <svg width="30" height="24" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.5 0H0V13.5C0 20.9558 6.04416 27 13.5 27V36C6.04416 36 0 29.9558 0 22.5V18H13.5V0ZM40.5 0H27V13.5C27 20.9558 33.0442 27 40.5 27V36C33.0442 36 27 29.9558 27 22.5V18H40.5V0Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <p className={`${compact ? 'mb-3 text-sm' : 'mb-6 text-lg'} italic text-white/90 flex-grow line-clamp-4`}>{quote}</p>
        <div>
          <p className="font-bold text-white">{author}</p>
          <p className="text-white/70 text-sm">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}
