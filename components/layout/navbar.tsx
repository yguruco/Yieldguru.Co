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
            <img
              src="/images/yg-logo.png"
              alt="YieldGuru Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/placeholder-logo.svg';
              }}
            />
          </div>
          <span className={cn("text-lg font-bold", isScrolled ? "text-gray-900" : "text-white")}>YieldGuru</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center flex-1">
          <ul className="flex space-x-8 justify-center">
            {["Features", "Solutions", "Blog", "Team", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  href={`#${item.toLowerCase()}`}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#fbdc3e] px-2 py-1",
                    isScrolled ? "text-gray-700" : "text-white",
                  )}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Login and Signup Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
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
            <Link href="/login/unified" className="flex items-center gap-1">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "transition-colors",
                  isScrolled
                    ? "border-[#4f1964] text-[#4f1964] hover:bg-[#4f1964]/10"
                    : "border-white text-[#4f1964] hover:bg-white/10",
                )}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                <span>Sign Up</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/signup/investor" className="flex items-center">
                  <LineChart className="mr-2 h-4 w-4" />
                  <span>Investor</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/signup/operator" className="flex items-center">
                  <Truck className="mr-2 h-4 w-4" />
                  <span>EV Operator</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        <div className="absolute left-1/2 right-auto top-[calc(100%+0.75rem)] w-[90%] -translate-x-1/2 rounded-xl bg-white p-4 shadow-lg md:hidden">
          <nav className="mb-6">
            <ul className="space-y-5">
              {["Features", "Solutions", "Blog", "Team", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="block text-sm font-medium text-gray-700 transition-colors hover:text-[#4f1964] py-2 px-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>



          <div className="space-y-2">
            <Button
              className="w-full bg-[#4f1964] text-white hover:bg-[#4f1964]/90"
              onClick={() => setIsMobileMenuOpen(false)}
              asChild
            >
              <Link href="/login/unified" className="flex items-center justify-center gap-1">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="border-[#4f1964] text-[#4f1964]"
                onClick={() => setIsMobileMenuOpen(false)}
                asChild
              >
                <Link href="/signup/investor" className="flex items-center justify-center gap-1">
                  <LineChart className="h-4 w-4" />
                  <span>Investor Signup</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="border-[#4f1964] text-[#4f1964]"
                onClick={() => setIsMobileMenuOpen(false)}
                asChild
              >
                <Link href="/signup/operator" className="flex items-center justify-center gap-1">
                  <Truck className="h-4 w-4" />
                  <span>Operator Signup</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}