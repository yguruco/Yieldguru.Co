"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface DashboardLayoutProps {
  children: React.ReactNode
  dashboardType?: string
  accentColor?: string
}

export function DashboardLayout({ children, dashboardType: propsDashboardType, accentColor: propsAccentColor }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage("sidebar-state", true)
  const pathname = usePathname()
  
  // Use props if provided, otherwise extract from URL
  const dashboardType = propsDashboardType || pathname.split("/")[2] || "admin"

  // Use props accent color if provided, otherwise calculate from dashboard type
  const accentColor = propsAccentColor || 
    (dashboardType === "admin" ? "#4f1964" : 
    dashboardType === "investor" ? "#fbdc3e" : "#f68b27")

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isOpen={isSidebarOpen} dashboardType={dashboardType} accentColor={accentColor} />

      <div className="flex flex-1 flex-col">
        <DashboardHeader dashboardType={dashboardType} accentColor={accentColor} toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
