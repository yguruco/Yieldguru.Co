import { Card, CardContent } from "@/components/ui/card"

interface TestimonialCardProps {
  quote: string
  author: string
  title: string
}

export default function TestimonialCard({ quote, author, title }: TestimonialCardProps) {
  return (
    <Card className="h-full bg-white/10 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="mb-4 text-[#fbdc3e]">
          <svg width="45" height="36" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.5 0H0V13.5C0 20.9558 6.04416 27 13.5 27V36C6.04416 36 0 29.9558 0 22.5V18H13.5V0ZM40.5 0H27V13.5C27 20.9558 33.0442 27 40.5 27V36C33.0442 36 27 29.9558 27 22.5V18H40.5V0Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <p className="mb-6 text-lg italic text-white/90">{quote}</p>
        <div>
          <p className="font-bold text-white">{author}</p>
          <p className="text-white/70">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}
