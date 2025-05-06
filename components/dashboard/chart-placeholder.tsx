import { BarChart, LineChart, PieChart } from "lucide-react"

interface ChartPlaceholderProps {
  type: "bar" | "line" | "pie"
  title: string
  description?: string
  className?: string
  height?: string
  accentColor?: string
}

export function ChartPlaceholder({
  type,
  title,
  description = "Interactive chart in production",
  className = "",
  height = "h-64",
  accentColor = "#4f1964",
}: ChartPlaceholderProps) {
  const ChartIcon = type === "bar" ? BarChart : type === "line" ? LineChart : PieChart

  return (
    <div
      className={`flex ${height} w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-center ${className}`}
    >
      <ChartIcon className="mb-2 h-8 w-8" style={{ color: accentColor }} />
      <div className="text-2xl font-bold">{title}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  )
}
