"use client"

import { motion } from "framer-motion"
import { Battery, MapPin, Calendar, Car } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface VehicleStatusCardProps {
  id: string
  type: string
  battery: number
  status: "Active" | "Charging" | "Maintenance" | "Inactive"
  location: string
  lastMaintenance: string
  index?: number
}

export default function VehicleStatusCard({
  id,
  type,
  battery,
  status,
  location,
  lastMaintenance,
  index = 0
}: VehicleStatusCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "Active":
        return "bg-green-500 border-green-600"
      case "Charging":
        return "bg-blue-500 border-blue-600"
      case "Maintenance":
        return "bg-orange-500 border-orange-600"
      case "Inactive":
        return "bg-red-500 border-red-600"
      default:
        return "bg-gray-500 border-gray-600"
    }
  }

  const getBatteryColor = () => {
    if (battery > 70) return "bg-green-500"
    if (battery > 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getVehicleIcon = () => {
    switch (type.toLowerCase()) {
      case "sedan":
        return <Car className="h-5 w-5 text-gray-700" />
      case "suv":
        return <Car className="h-5 w-5 text-gray-700" />
      case "van":
        return <Car className="h-5 w-5 text-gray-700" />
      case "bus":
        return <Car className="h-5 w-5 text-gray-700" />
      default:
        return <Car className="h-5 w-5 text-gray-700" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              {getVehicleIcon()}
            </div>
            <h3 className="font-medium">{id}</h3>
            <Badge variant="outline" className="bg-gray-50">
              {type}
            </Badge>
            <Badge className={`${getStatusColor()} text-white border`}>
              {status}
            </Badge>
          </div>
          <div className="mt-2 flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {lastMaintenance}
            </span>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-48">
          <Battery className={`h-4 w-4 ${battery < 30 ? "text-red-500" : battery < 70 ? "text-yellow-500" : "text-green-500"}`} />
          <span className="text-sm font-medium">{battery}%</span>
          <div className="relative flex-1">
            <Progress value={battery} className={getBatteryColor()} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"></div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
