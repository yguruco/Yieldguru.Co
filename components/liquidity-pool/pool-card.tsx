"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"

interface PoolCardProps {
  id: string
  name: string
  token1: string
  token2: string
  token1Logo: string
  token2Logo: string
  apr: string
  tvl: string
  volume24h: string
  myLiquidity: string
  onClick?: () => void
}

export default function PoolCard({
  id,
  name,
  token1,
  token2,
  token1Logo,
  token2Logo,
  apr,
  tvl,
  volume24h,
  myLiquidity,
  onClick
}: PoolCardProps) {
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
              <div className="relative flex -space-x-2">
                <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-white">
                  <Image
                    src={token1Logo}
                    alt={token1}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-white">
                  <Image
                    src={token2Logo}
                    alt={token2}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-medium">{name}</h3>
                <p className="text-xs text-gray-500">Pool</p>
              </div>
            </div>
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700">
              {apr} APR
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <p className="text-xs text-gray-500">TVL</p>
              <p className="font-medium">{tvl}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">24h Volume</p>
              <p className="font-medium">{volume24h}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">My Liquidity</p>
              <p className="font-medium">{myLiquidity}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
