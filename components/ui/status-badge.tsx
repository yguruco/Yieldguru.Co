import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "Active" | "Inactive" | "Pending" | "Maintenance" | "Charging" | "Onboarding"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Charging":
        return "bg-blue-500"
      case "Maintenance":
        return "bg-orange-500"
      case "Inactive":
        return "bg-red-500"
      case "Pending":
        return "bg-yellow-500"
      case "Onboarding":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return <Badge className={cn(getStatusColor(), className)}>{status}</Badge>
}
