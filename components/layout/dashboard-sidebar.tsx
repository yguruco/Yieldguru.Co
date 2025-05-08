"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { getNavItems } from "@/lib/dashboard-navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface DashboardSidebarProps {
  isOpen: boolean
  dashboardType: string
  accentColor: string
}

export function DashboardSidebar({ isOpen, dashboardType, accentColor }: DashboardSidebarProps) {
  const pathname = usePathname()
  const navItems = getNavItems(dashboardType)

  return (
    <>
      {/* Desktop Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden border-r border-gray-200 bg-white lg:block"
          >
            <div className="flex h-16 items-center border-b border-gray-200 px-6">
              <div className="flex items-center gap-2">
                <div className="relative h-6 w-6 overflow-hidden">
                  <Image
                    src="/images/YG LOGO.png"
                    alt="YieldGuru Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold">YieldGuru</span>
              </div>
            </div>

            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === `/dashboard/${dashboardType}${item.href}`
                  return (
                    <li key={item.name}>
                      <Link
                        href={`/dashboard/${dashboardType}${item.href}`}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                          isActive ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <div className="flex h-16 items-center border-b border-gray-200 px-6">
              <div className="flex items-center gap-2">
                <div className="relative h-6 w-6 overflow-hidden">
                  <Image
                    src="/images/YG LOGO.png"
                    alt="YieldGuru Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold">YieldGuru</span>
              </div>
            </div>

            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === `/dashboard/${dashboardType}${item.href}`
                  return (
                    <li key={item.name}>
                      <Link
                        href={`/dashboard/${dashboardType}${item.href}`}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                          isActive ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
