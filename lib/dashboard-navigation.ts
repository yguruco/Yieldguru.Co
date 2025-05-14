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
    { name: "Tokenize", href: "/tokenize", icon: Shield },
    { name: "Create Loan", href: "/create-loan", icon: Wallet },
  ]

  const investorItems = [
    { name: "Portfolio", href: "/portfolio", icon: LineChart },
    { name: "Marketplace", href: "/marketplace", icon: BarChart },
  ]

  const operatorItems = [
    { name: "Loan Repayment", href: "/loan-repayment", icon: RefreshCw },
    { name: "Performance", href: "/performance", icon: Shield },
    { name: "RFL", href: "/rfl", icon: BookOpen },
    { name: "My Assets", href: "/my-assets", icon: Car },
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
