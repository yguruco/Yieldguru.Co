"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const dashboardType = pathname.split("/")[2] || "" // Extract dashboard type from URL

  // Get accent color based on dashboard type
  const accentColor = 
    dashboardType === "admin" ? "#4f1964" : 
    dashboardType === "investor" ? "#fbdc3e" : 
    dashboardType === "operator" ? "#f68b27" : ""
    
  return (
    <DashboardLayout dashboardType={dashboardType} accentColor={accentColor}>
      {children}
    </DashboardLayout>
  )
}
