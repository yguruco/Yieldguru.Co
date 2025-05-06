"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface PoolCardProps {
  name: string
  token1: string
  token2: string
  token1Logo: string
  token2Logo: string
  apr: string
  tvl: string
  volume24h: string
  myLiquidity?: string
  onClick?: () => void
}

export default function PoolCard({
  name,
  token1,
  token2,
  token1Logo,
  token2Logo,
  apr,
  tvl,
  volume24h,
  myLiquidity,
  onClick,
}: PoolCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card className="overflow-hidden h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{name}</CardTitle>
            <div className="flex -space-x-2">
              <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-white bg-white z-10">
                <img src={token1Logo || "/placeholder.svg"} alt={token1} className="object-cover" />
              </div>
              <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-white bg-white">
                <img src={token2Logo || "/placeholder.svg"} alt={token2} className="object-cover" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div>
              <p className="text-xs text-gray-500">APR</p>
              <p className="font-bold text-green-600">{apr}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">TVL</p>
              <p className="font-medium">{tvl}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">24h Volume</p>
              <p className="font-medium">{volume24h}</p>
            </div>
          </div>

          {myLiquidity && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">My Liquidity</span>
                <span className="font-medium">{myLiquidity}</span>
              </div>
              <Progress value={70} className="h-1.5" />
            </div>
          )}

          <Button
            onClick={onClick}
            className="w-full bg-gradient-to-r from-[#4f1964] to-[#6b21a8] hover:from-[#6b21a8] hover:to-[#4f1964]"
          >
            <span>Manage</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
