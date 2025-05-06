"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 py-3 shadow-md backdrop-blur-md dark:bg-gray-900/90" : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#fbdc3e]"></div>
          <span className={cn("text-xl font-bold", isScrolled ? "text-gray-900" : "text-white")}>YieldGuru</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {["Features", "Solutions", "Pricing", "Resources", "Blog"].map((item) => (
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
        </nav>

        {/* Auth Buttons */}
        <div className="hidden items-center space-x-4 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-2 transition-colors",
                  isScrolled ? "text-gray-700 hover:text-[#4f1964]" : "text-white hover:text-[#fbdc3e]",
                )}
              >
                Dashboards
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Access Dashboards</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login/admin" className="flex w-full cursor-pointer items-center">
                  <Shield className="mr-2 h-4 w-4 text-[#4f1964]" />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/login/investor" className="flex w-full cursor-pointer items-center">
                  <LineChart className="mr-2 h-4 w-4 text-[#fbdc3e]" />
                  <span>Investor Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/login/operator" className="flex w-full cursor-pointer items-center">
                  <Truck className="mr-2 h-4 w-4 text-[#f68b27]" />
                  <span>EV-Operator Dashboard</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-2 transition-colors",
                  isScrolled ? "text-gray-700 hover:text-[#4f1964]" : "text-white hover:text-[#fbdc3e]",
                )}
              >
                Account
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/login/admin" className="flex w-full cursor-pointer items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Log in</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/signup" className="flex w-full cursor-pointer items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Sign up</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className={cn(
              "transition-colors",
              isScrolled
                ? "bg-[#4f1964] text-white hover:bg-[#4f1964]/90"
                : "bg-white text-[#4f1964] hover:bg-white/90",
            )}
          >
            Get Started
          </Button>
        </div>

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
        <div className="absolute left-0 right-0 top-full bg-white p-4 shadow-md md:hidden">
          <nav className="mb-4">
            <ul className="space-y-3">
              {["Features", "Solutions", "Pricing", "Resources", "Blog"].map((item) => (
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
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Dashboards</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login/admin"
                  className="flex items-center text-sm text-gray-700 transition-colors hover:text-[#4f1964]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shield className="mr-2 h-4 w-4 text-[#4f1964]" />
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/login/investor"
                  className="flex items-center text-sm text-gray-700 transition-colors hover:text-[#4f1964]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LineChart className="mr-2 h-4 w-4 text-[#fbdc3e]" />
                  Investor Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/login/operator"
                  className="flex items-center text-sm text-gray-700 transition-colors hover:text-[#4f1964]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Truck className="mr-2 h-4 w-4 text-[#f68b27]" />
                  EV-Operator Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-2">
            <Link
              href="/login/admin"
              className="flex items-center justify-center text-sm font-medium text-gray-700 transition-colors hover:text-[#4f1964]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Log in
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-center text-sm font-medium text-gray-700 transition-colors hover:text-[#4f1964]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Sign up
            </Link>
            <Button
              className="mt-2 w-full bg-[#4f1964] text-white hover:bg-[#4f1964]/90"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
