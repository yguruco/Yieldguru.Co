"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, LogIn, Menu, Shield, LineChart, Truck, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed left-1/2 top-6 z-50 -translate-x-1/2 transition-all duration-300",
        isScrolled
          ? "w-[95%] max-w-6xl rounded-xl bg-white/90 py-3 shadow-md backdrop-blur-md dark:bg-gray-900/90"
          : "w-[90%] max-w-5xl rounded-full bg-black/20 py-3 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden">
            <Image
              src="/images/YG LOGO.png"
              alt="YieldGuru Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className={cn("text-lg font-bold", isScrolled ? "text-gray-900" : "text-white")}>YieldGuru</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6">
            {["Features", "Solutions", "Pricing", "Blog"].map((item) => (
              <li key={item}>
                <Link
                  href={`#${item.toLowerCase()}`}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#fbdc3e]",
                    isScrolled ? "text-gray-700" : "text-white",
                  )}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          <div className="h-5 w-px bg-gray-300/50"></div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center gap-1 transition-colors px-2",
                  isScrolled ? "text-gray-700 hover:text-[#4f1964]" : "text-white hover:text-[#fbdc3e]",
                )}
              >
                Dashboards
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/login/admin" className="flex w-full cursor-pointer items-center">
                  <Shield className="mr-2 h-4 w-4 text-[#4f1964]" />
                  <span>Admin</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/login/investor" className="flex w-full cursor-pointer items-center">
                  <LineChart className="mr-2 h-4 w-4 text-[#fbdc3e]" />
                  <span>Investor</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/login/operator" className="flex w-full cursor-pointer items-center">
                  <Truck className="mr-2 h-4 w-4 text-[#f68b27]" />
                  <span>Operator</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            className={cn(
              "transition-colors",
              isScrolled
                ? "bg-[#4f1964] text-white hover:bg-[#4f1964]/90"
                : "bg-white text-[#4f1964] hover:bg-white/90",
            )}
            asChild
          >
            <Link href="/login" className="flex items-center gap-1">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
          {isMobileMenuOpen ? (
            <X className={isScrolled ? "text-gray-900" : "text-white"} />
          ) : (
            <Menu className={isScrolled ? "text-gray-900" : "text-white"} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute left-1/2 right-auto top-[calc(100%+0.75rem)] w-[90%] -translate-x-1/2 rounded-xl bg-white p-4 shadow-lg md:hidden">
          <nav className="mb-4">
            <ul className="space-y-3">
              {["Features", "Solutions", "Pricing", "Blog"].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="block text-sm font-medium text-gray-700 transition-colors hover:text-[#4f1964]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mb-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Dashboards</h3>
            <ul className="grid grid-cols-3 gap-2">
              <li>
                <Link
                  href="/login/admin"
                  className="flex flex-col items-center rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-[#4f1964]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shield className="mb-1 h-5 w-5 text-[#4f1964]" />
                  <span className="text-xs">Admin</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login/investor"
                  className="flex flex-col items-center rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-[#4f1964]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LineChart className="mb-1 h-5 w-5 text-[#fbdc3e]" />
                  <span className="text-xs">Investor</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login/operator"
                  className="flex flex-col items-center rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-[#4f1964]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Truck className="mb-1 h-5 w-5 text-[#f68b27]" />
                  <span className="text-xs">Operator</span>
                </Link>
              </li>
            </ul>
          </div>

          <Button
            className="mt-2 w-full bg-[#4f1964] text-white hover:bg-[#4f1964]/90"
            onClick={() => setIsMobileMenuOpen(false)}
            asChild
          >
            <Link href="/login" className="flex items-center justify-center gap-1">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
          </Button>
        </div>
      )}
    </header>
  )
}
