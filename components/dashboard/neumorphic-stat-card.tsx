"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

interface NeumorphicStatCardProps {
  title: string
  value: string
  description: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon?: React.ReactNode
  accentColor?: string
  delay?: number
}

export default function NeumorphicStatCard({
  title,
  value,
  description,
  trend = "neutral",
  trendValue,
  icon,
  accentColor = "#f68b27",
  delay = 0
}: NeumorphicStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="h-full"
    >
      <div className="h-full rounded-xl bg-white p-2 shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] transition-all duration-300 hover:shadow-[12px_12px_20px_#d1d1d1,-12px_-12px_20px_#ffffff]">
        <div className="rounded-lg bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon && (
                <div 
                  className="flex h-10 w-10 items-center justify-center rounded-full shadow-[inset_3px_3px_6px_rgba(0,0,0,0.05),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]"
                  style={{ backgroundColor: `${accentColor}10` }}
                >
                  {icon}
                </div>
              )}
              <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            </div>
            
            {trend !== "neutral" && trendValue && (
              <div 
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                  trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          
          <div className="mt-3">
            <div 
              className="text-2xl font-bold shimmer"
              style={{ color: accentColor }}
            >
              {value}
            </div>
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
