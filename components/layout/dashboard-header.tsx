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
      className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4"
      style={{ borderTopColor: accentColor, borderTopWidth: "3px" }}
    >
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden lg:flex">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 overflow-hidden">
            <Image
              src="/images/YG LOGO.png"
              alt="YieldGuru Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-bold">{dashboardTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationsButton />
        <UserMenu dashboardType={dashboardType} />
      </div>
    </header>
  )
}


function NotificationsButton() {
  return (
    <Button variant="ghost" size="icon">
      <Bell className="h-5 w-5" />
    </Button>
  )
}

function UserMenu({ dashboardType }: { dashboardType: string }) {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src="/images/YG LOGO.png"
              alt="User Avatar"
              fill
              className="object-contain"
            />
          </div>
          <span className="hidden sm:inline-block">{user?.name || "Loading..."}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/${dashboardType}/profile`}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
