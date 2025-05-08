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
    { name: "Users", href: "/users", icon: Users },
    { name: "Assets", href: "/assets", icon: Wallet },
    { name: "RFT Approvals", href: "/rft-approvals", icon: BookOpen },
    { name: "Tokenize", href: "/tokenize", icon: Shield },
    { name: "Liquidity Pool", href: "/liquidity-pool", icon: Droplets },

  ]

  const investorItems = [
    { name: "Portfolio", href: "/portfolio", icon: LineChart },
    { name: "Marketplace", href: "/marketplace", icon: BarChart },
    { name: "Liquidity Pool", href: "/liquidity-pool", icon: Droplets },
  ]

  const operatorItems = [
    { name: "Fleet", href: "/fleet", icon: Truck },
    { name: "Performance", href: "/performance", icon: Shield },
    { name: "RFT", href: "/rft", icon: BookOpen },
    { name: "My Assets", href: "/my-assets", icon: Car },
    { name: "Liquidity Pool", href: "/liquidity-pool", icon: Droplets },
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
