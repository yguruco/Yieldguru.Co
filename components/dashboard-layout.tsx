"use client"

import type React from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  accentColor?: string
  dashboardType?: string
}

export default function DashboardLayout({ children, title, accentColor, dashboardType }: DashboardLayoutProps) {
  return <div>{children}</div>
}
