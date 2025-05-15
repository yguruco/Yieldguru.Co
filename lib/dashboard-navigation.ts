import { BarChart, BookOpen, Car, Home, LineChart, Shield, Truck, Users, Wallet, Droplets, UserCircle } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
}

export function getNavItems(dashboardType: string): NavItem[] {
  const baseItems = [
    { name: "Overview", href: "", icon: Home },
    { name: "Profile", href: "/profile", icon: UserCircle }
  ]

  const adminItems = [
    { name: "Assets", href: "/assets", icon: Wallet },
    { name: "RFT Approvals", href: "/rft-approvals", icon: BookOpen },
    { name: "Tokenize", href: "/tokenize", icon: Shield },
    { name: "Liquidity Pool", href: "/liquidity-pool", icon: Droplets },

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
