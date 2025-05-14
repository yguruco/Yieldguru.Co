import { BarChart, BookOpen, Car, Home, LineChart, Shield, Truck, Wallet, RefreshCw } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
}

export function getNavItems(dashboardType: string): NavItem[] {
  const baseItems = [{ name: "Overview", href: "", icon: Home }]

  const adminItems = [
    { name: "Assets", href: "/assets", icon: Wallet },
    { name: "RFL Approvals", href: "/rfl-approvals", icon: BookOpen },
    { name: "Loan Management", href: "/tokenize", icon: RefreshCw },
    { name: "Create Loan", href: "/create-loan", icon: Wallet },
  ]

  const investorItems = [
    { name: "Portfolio", href: "/portfolio", icon: LineChart },
    { name: "Marketplace", href: "/marketplace", icon: BarChart },
  ]

  const operatorItems = [
    { name: "Loan Management", href: "/loan-management", icon: RefreshCw },
    { name: "RFL", href: "/rfl", icon: BookOpen },
  ]

  switch (dashboardType) {
    case "admin":
      return [...baseItems, ...adminItems]
    case "investor":
      return [...baseItems, ...investorItems]
    case "operator":
      return [...baseItems, ...operatorItems]
    default:
      return baseItems
  }
}
