"use client"

import { Bell, ChevronDown, Menu, Settings, User } from "lucide-react"
import LogoutButton from "@/components/logout-button"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/lib/auth"
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
      className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm relative z-10"
      style={{
        borderTopColor: accentColor,
        borderTopWidth: "3px",
        background: `linear-gradient(to right, white, white, ${accentColor}05)`
      }}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden lg:flex hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight">{dashboardTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        <NotificationsButton />
        <UserMenu />
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

function UserMenu() {
  // Get user from auth store
  const user = useAuthStore((state) => state.user)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200" />
          <span className="hidden sm:inline-block">{user?.name || "Guest"}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutButton variant="ghost" size="sm" showIcon={true} className="w-full justify-start p-0" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
