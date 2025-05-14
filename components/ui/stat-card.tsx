"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"

export interface StatCardProps {
  title: string
  value: string
  description?: string
  trend?: "up" | "down"
  trendValue?: string
}

export function StatCard({ title, value, description, trend, trendValue }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend && trendValue && (
          <div className={`flex items-center text-xs ${
            trend === "up" ? "text-green-500" : "text-red-500"
          }`}>
            {trend === "up" ? (
              <ArrowUp className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDown className="mr-1 h-3 w-3" />
            )}
            {trendValue}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}
