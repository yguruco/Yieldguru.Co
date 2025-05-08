import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface TestimonialCardProps {
  quote: string
  author: string
  title: string
  originalIndex?: number
  glassmorphic?: boolean
  compact?: boolean
}

export default function TestimonialCard({
  quote,
  author,
  title,
  originalIndex,
  glassmorphic = false,
  compact = false
}: TestimonialCardProps) {
  return (
    <Card
      className={`h-full relative overflow-hidden group ${
        glassmorphic
          ? "bg-white/10 backdrop-blur-md border border-white/20"
          : "bg-white/10 backdrop-blur-sm"
      } ${compact ? "max-h-[280px]" : ""}`}
      style={{
        boxShadow: glassmorphic ? "0 8px 32px rgba(0, 0, 0, 0.1)" : undefined
      }}
    >
      {glassmorphic && (
        <>
          {/* Glassmorphic highlights */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
          <div className="absolute -inset-1 bg-gradient-to-br from-[#fbdc3e]/10 via-transparent to-[#fbdc3e]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </>
      )}

      <CardContent className={`${compact ? "p-4" : "p-6"} relative z-10`}>
        <div className={`${compact ? "mb-2" : "mb-4"} text-[#fbdc3e]`}>
          <svg width={compact ? "30" : "45"} height={compact ? "24" : "36"} viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.5 0H0V13.5C0 20.9558 6.04416 27 13.5 27V36C6.04416 36 0 29.9558 0 22.5V18H13.5V0ZM40.5 0H27V13.5C27 20.9558 33.0442 27 40.5 27V36C33.0442 36 27 29.9558 27 22.5V18H40.5V0Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <p className={`${compact ? "mb-3 text-sm line-clamp-3" : "mb-6 text-lg"} italic text-white/90`}>{quote}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-bold text-white ${compact ? "text-sm" : ""}`}>{author}</p>
            <p className={`text-white/70 ${compact ? "text-xs" : ""}`}>{title}</p>
          </div>
          {glassmorphic && (
            <motion.div
              className={`${compact ? "h-6 w-6" : "h-8 w-8"} rounded-full bg-[#fbdc3e]/20 flex items-center justify-center`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={`text-[#fbdc3e] ${compact ? "text-[10px]" : "text-xs"} font-bold`}>
                {(originalIndex !== undefined ? originalIndex : 0) + 1}
              </span>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
