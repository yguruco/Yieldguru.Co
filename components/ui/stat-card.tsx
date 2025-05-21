"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export interface StatCardProps {
  title: string
  value: string
  description?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
  icon?: ReactNode
}

export function StatCard({
  title,
  value,
  description,
  trend,
  trendValue,
  className,
  icon
}: StatCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md border-l-4 relative",
      trend === "up" ? "border-l-green-500" :
      trend === "down" ? "border-l-red-500" :
      "border-l-blue-500",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-50 pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {icon || (trend === "up" ?
            <div className="p-1.5 rounded-full bg-green-100 text-green-600">
              <BarChart3 className="h-3.5 w-3.5" />
            </div> :
            trend === "down" ?
            <div className="p-1.5 rounded-full bg-red-100 text-red-600">
              <BarChart3 className="h-3.5 w-3.5" />
            </div> :
            <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
              <BarChart3 className="h-3.5 w-3.5" />
            </div>
          )}
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        {trend && trendValue && (
          <div className={cn("flex items-center text-xs font-medium px-2 py-1 rounded-full",
            trend === "up" ? "bg-green-50 text-green-600" :
            trend === "down" ? "bg-red-50 text-red-600" :
            "bg-blue-50 text-blue-600"
          )}>
            {trend === "up" ? (
              <ArrowUp className="mr-1 h-3 w-3" />
            ) : trend === "down" ? (
              <ArrowDown className="mr-1 h-3 w-3" />
            ) : null}
            {trendValue}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
