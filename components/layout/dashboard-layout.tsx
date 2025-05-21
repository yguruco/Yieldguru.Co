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
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-gray-100/40 pointer-events-none"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 30 30\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z\' fill=\'rgba(200,200,200,0.15)\'/%3E%3C/svg%3E")' }}
      ></div>

      <DashboardSidebar isOpen={isSidebarOpen} dashboardType={dashboardType} accentColor={accentColor} />

      <div className="flex flex-1 flex-col">
        <DashboardHeader dashboardType={dashboardType} accentColor={accentColor} toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
