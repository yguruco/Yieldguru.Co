"use client"

import Link from "next/link"
import Image from "next/image"
import { Bell, ChevronDown, LogOut, Menu, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"

interface DashboardHeaderProps {
  dashboardType: string
  accentColor: string
  toggleSidebar: () => void
}

export function DashboardHeader({ dashboardType, accentColor, toggleSidebar }: DashboardHeaderProps) {
  const dashboardTitle =
    dashboardType === "admin"
      ? "Admin Dashboard"
      : dashboardType === "investor"
        ? "Investor Dashboard"
        : "EV-Operator Dashboard"

  return (
    <header
      className="flex h-16 items-center justify-between px-4 backdrop-blur-sm bg-white/90 relative"
      style={{
        boxShadow: `0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(0, 0, 0, 0.05)`
      }}
    >
      {/* Top accent border with gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(to right, ${accentColor}, #4f1964)`
        }}
      />

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden lg:flex rounded-full hover:bg-gray-100/80 transition-all duration-300"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden">
            <Image
              src="/images/YG LOGO.png"
              alt="YieldGuru Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1
            className="text-xl font-bold shimmer"
            style={{ color: accentColor }}
          >
            {dashboardTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationsButton accentColor={accentColor} />
        <UserMenu dashboardType={dashboardType} accentColor={accentColor} />
      </div>
    </header>
  )
}


function NotificationsButton({ accentColor = "#f68b27" }: { accentColor?: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full hover:bg-gray-100/80 transition-all duration-300 relative group"
    >
      <Bell className="h-5 w-5" style={{ color: accentColor }} />
      <span
        className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border border-white"
        style={{
          boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.8)'
        }}
      />
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle, ${accentColor}15, transparent 70%)`
        }}
      />
    </Button>
  )
}

function UserMenu({ dashboardType, accentColor = "#f68b27" }: { dashboardType: string, accentColor?: string }) {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-gray-100/80 transition-all duration-300 group"
        >
          <div
            className="relative h-8 w-8 overflow-hidden rounded-full border-2 transition-all duration-300"
            style={{ borderColor: `${accentColor}50` }}
          >
            <Image
              src="/images/YG LOGO.png"
              alt="User Avatar"
              fill
              className="object-contain"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle, ${accentColor}30, transparent 70%)`
              }}
            />
          </div>
          <span
            className="hidden sm:inline-block font-medium transition-colors duration-300"
            style={{ color: '#333' }}
          >
            {user?.name || "Loading..."}
          </span>
          <ChevronDown
            className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180"
            style={{ color: accentColor }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 p-1 rounded-lg border border-gray-200 shadow-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <DropdownMenuLabel className="px-3 py-2 text-sm font-medium">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem asChild className="rounded-md focus:bg-gray-100">
          <Link
            href={`/dashboard/${dashboardType}/profile`}
            className="flex items-center px-3 py-2 text-sm cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" style={{ color: accentColor }} />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-md focus:bg-gray-100">
          <div className="flex items-center px-3 py-2 text-sm cursor-pointer">
            <Settings className="mr-2 h-4 w-4" style={{ color: accentColor }} />
            Settings
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="rounded-md focus:bg-gray-100 text-red-600 hover:text-red-700"
        >
          <div className="flex items-center px-3 py-2 text-sm cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
