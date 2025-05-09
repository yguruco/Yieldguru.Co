"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface GlassmorphicCardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  accentColor?: string
  delay?: number
  noPadding?: boolean
}

export default function GlassmorphicCard({
  title,
  description,
  children,
  className = "",
  accentColor = "#f68b27",
  delay = 0,
  noPadding = false
}: GlassmorphicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card
        className={`relative h-full overflow-hidden group border border-white/10 bg-white/80 backdrop-blur-sm ${className}`}
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
        }}
      >
        {/* Glassmorphic highlights */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
        <div 
          className="absolute -inset-1 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ 
            backgroundImage: `linear-gradient(to bottom right, ${accentColor}10, transparent, ${accentColor}05)` 
          }}
        ></div>
        
        {/* Top accent border */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 opacity-70"
          style={{ backgroundColor: accentColor }}
        ></div>

        {title && (
          <CardHeader className="relative z-10">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        
        <CardContent className={`relative z-10 ${noPadding ? 'p-0' : ''} ${!title ? 'pt-6' : ''}`}>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  )
}
