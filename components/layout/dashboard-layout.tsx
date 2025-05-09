"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { useLocalStorage } from "@/hooks/use-local-storage"
import DashboardBackground from "@/components/dashboard/dashboard-background"
import { motion, AnimatePresence } from "framer-motion"

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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Animated background */}
      <DashboardBackground accentColor={accentColor} />

      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${accentColor}10, transparent 70%),
                      radial-gradient(circle at 70% 70%, #4f196410, transparent 70%)`
        }}
      />

      {/* Dashboard content */}
      <div className="flex w-full relative z-10">
        {/* Sidebar with higher z-index to ensure it's clickable */}
        <div className="relative z-20">
          <DashboardSidebar isOpen={isSidebarOpen} dashboardType={dashboardType} accentColor={accentColor} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0.8, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0.8, x: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-1 flex-col"
          >
            <DashboardHeader dashboardType={dashboardType} accentColor={accentColor} toggleSidebar={toggleSidebar} />

            <main className="flex-1 p-6 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                {children}
              </motion.div>
            </main>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
