"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface TokenCardProps {
  symbol: string
  name: string
  balance: string
  price: string
  change: string
  isPositive: boolean
  logo: string
  onClick?: () => void
  selected?: boolean
}

export default function TokenCard({
  symbol,
  name,
  balance,
  price,
  change,
  isPositive,
  logo,
  onClick,
  selected = false,
}: TokenCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer ${selected ? "ring-2 ring-[#4f1964] ring-offset-2" : ""}`}
      onClick={onClick}
    >
      <Card className="overflow-hidden h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100">
              <Image src={logo || "/placeholder.svg"} alt={name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{symbol}</h3>
                <Badge variant={selected ? "default" : "outline"} className={selected ? "bg-[#4f1964]" : ""}>
                  {balance}
                </Badge>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-500">{name}</p>
                <div className="flex items-center">
                  <span className="font-medium">${price}</span>
                  <span className={`text-xs ml-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
                    {isPositive ? "+" : ""}
                    {change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
