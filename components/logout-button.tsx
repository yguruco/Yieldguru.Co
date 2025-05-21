"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  showIcon?: boolean
  className?: string
}

export default function LogoutButton({
  variant = "ghost",
  size = "sm",
  showIcon = true,
  className = "",
}: LogoutButtonProps) {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)
  const { toast } = useToast()

  const handleLogout = () => {
    logout()
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    
    router.push("/")
  }

  return (
    <Button variant={variant} size={size} onClick={handleLogout} className={className}>
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      Logout
    </Button>
  )
}
