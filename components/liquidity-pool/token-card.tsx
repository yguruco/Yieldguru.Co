"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"

interface TokenCardProps {
  symbol: string
  name: string
  balance: string
  price: string
  change: string
  isPositive: boolean
  logo: string
  onClick?: () => void
}

export default function TokenCard({
  symbol,
  name,
  balance,
  price,
  change,
  isPositive,
  logo,
  onClick
}: TokenCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card 
        className="overflow-hidden h-full cursor-pointer border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-md"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-full overflow-hidden">
                <Image
                  src={logo}
                  alt={symbol}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{symbol}</h3>
                <p className="text-xs text-gray-500">{name}</p>
              </div>
            </div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {change}
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-500">Balance</p>
              <p className="font-medium">{balance}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Price</p>
              <p className="font-medium">${price}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
