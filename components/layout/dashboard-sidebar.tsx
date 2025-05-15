"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { getNavItems } from "@/lib/dashboard-navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import ClientWallet from "@/components/onchainKit/ClientWallet"

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
            className="hidden lg:block relative z-20 pointer-events-auto h-screen"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '4px 0 15px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div
              className="flex h-16 items-center px-6 relative"
              style={{
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Left accent border */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{
                  background: `linear-gradient(to bottom, ${accentColor}, #4f1964)`
                }}
              />

              <div className="flex items-center gap-2">
                <div
                  className="relative h-8 w-8 overflow-hidden rounded-full shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}20, #4f196420)`,
                    padding: '2px'
                  }}
                >
                  <Image
                    src="/images/YG LOGO.png"
                    alt="YieldGuru Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span
                  className="text-lg font-bold shimmer"
                  style={{ color: accentColor }}
                >
                  YieldGuru
                </span>
              </div>
            </div>

            <nav className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
              <div className="space-y-6">
                <div>
                  <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Main
                  </h3>
                  <ul className="space-y-1">
                    {navItems.map((item, index) => {
                      const isActive = pathname === `/dashboard/${dashboardType}${item.href}`
                      return (
                        <motion.li
                          key={item.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Link
                            href={`/dashboard/${dashboardType}${item.href}`}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 ${
                              isActive
                                ? "bg-white font-medium shadow-[3px_3px_6px_rgba(0,0,0,0.05),-3px_-3px_6px_rgba(255,255,255,0.8)]"
                                : "text-gray-700 hover:bg-white/80"
                            }`}
                            style={{
                              color: isActive ? accentColor : undefined,
                            }}
                          >
                            <div className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-300 ${
                              isActive ? 'text-white' : 'text-gray-500'
                            }`}
                            style={{
                              backgroundColor: isActive ? accentColor : 'transparent',
                            }}>
                              <item.icon className="h-4 w-4" />
                            </div>
                            <span>{item.name}</span>

                            {/* Active indicator */}
                            {isActive && (
                              <motion.div
                                layoutId="sidebar-active-indicator"
                                className="ml-auto h-2 w-2 rounded-full"
                                style={{ backgroundColor: accentColor }}
                              />
                            )}
                          </Link>
                        </motion.li>
                      )
                    })}
                  </ul>
                </div>

                <div>
                  <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Support
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        href="#"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-700 transition-all duration-300 hover:bg-white/80"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </div>
                        <span>Help & Support</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-700 transition-all duration-300 hover:bg-white/80"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                          </svg>
                        </div>
                        <span>Contact Us</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Wallet at the bottom of the sidebar */}
              <div className="mt-auto pt-6 border-t border-gray-200 mt-6">
                <ClientWallet />
              </div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <div className="lg:hidden relative z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 rounded-full hover:bg-gray-100/80 transition-all duration-300"
            >
              <Menu className="h-5 w-5" style={{ color: accentColor }} />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[280px] p-0 border-r-0"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div
              className="flex h-16 items-center px-6 relative"
              style={{
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Left accent border */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{
                  background: `linear-gradient(to bottom, ${accentColor}, #4f1964)`
                }}
              />

              <div className="flex items-center gap-2">
                <div
                  className="relative h-8 w-8 overflow-hidden rounded-full shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}20, #4f196420)`,
                    padding: '2px'
                  }}
                >
                  <Image
                    src="/images/YG LOGO.png"
                    alt="YieldGuru Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span
                  className="text-lg font-bold shimmer"
                  style={{ color: accentColor }}
                >
                  YieldGuru
                </span>
              </div>
            </div>

            <nav className="p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Main
                  </h3>
                  <ul className="space-y-1">
                    {navItems.map((item, index) => {
                      const isActive = pathname === `/dashboard/${dashboardType}${item.href}`
                      return (
                        <motion.li
                          key={item.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Link
                            href={`/dashboard/${dashboardType}${item.href}`}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 ${
                              isActive
                                ? "bg-white font-medium shadow-[3px_3px_6px_rgba(0,0,0,0.05),-3px_-3px_6px_rgba(255,255,255,0.8)]"
                                : "text-gray-700 hover:bg-white/80"
                            }`}
                            style={{
                              color: isActive ? accentColor : undefined,
                            }}
                          >
                            <div className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-300 ${
                              isActive ? 'text-white' : 'text-gray-500'
                            }`}
                            style={{
                              backgroundColor: isActive ? accentColor : 'transparent',
                            }}>
                              <item.icon className="h-4 w-4" />
                            </div>
                            <span>{item.name}</span>

                            {/* Active indicator */}
                            {isActive && (
                              <motion.div
                                layoutId="sidebar-active-indicator-mobile"
                                className="ml-auto h-2 w-2 rounded-full"
                                style={{ backgroundColor: accentColor }}
                              />
                            )}
                          </Link>
                        </motion.li>
                      )
                    })}
                  </ul>
                </div>

                <div>
                  <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Support
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        href="#"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-700 transition-all duration-300 hover:bg-white/80"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </div>
                        <span>Help & Support</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-700 transition-all duration-300 hover:bg-white/80"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                          </svg>
                        </div>
                        <span>Contact Us</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Wallet at the bottom of the mobile sidebar */}
              <div className="mt-auto pt-6 border-t border-gray-200 mt-6">
                <ClientWallet />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
