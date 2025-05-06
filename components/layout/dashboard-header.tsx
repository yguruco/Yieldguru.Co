"use client"

import Link from "next/link"
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
        <h1 className="text-xl font-bold">{dashboardTitle}</h1>
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200" />
          <span className="hidden sm:inline-block">John Doe</span>
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
        <DropdownMenuItem asChild>
          <Link href="/">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
