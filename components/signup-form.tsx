"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Info } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { signupUser, loginUser } from "@/lib/auth"
import { useAuthStore } from "@/lib/auth"

interface SignupFormProps {
  dashboardType: string
  accentColor: string
  passwordRequirements: string
}

export default function SignupForm({ dashboardType, accentColor, passwordRequirements }: SignupFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const login = useAuthStore((state) => state.login)

  const validatePassword = (password: string): boolean => {
    // Different validation based on dashboard type
    if (dashboardType === "admin") {
      // Admin: uppercase, number, special char
      return /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)
    } else if (dashboardType === "investor") {
      // Investor: 10+ chars, lowercase, number
      return password.length >= 10 && /[a-z]/.test(password) && /[0-9]/.test(password)
    } else {
      // Operator: 8+ chars, special char, uppercase
      return password.length >= 8 && /[!@#$%^&*]/.test(password) && /[A-Z]/.test(password)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate inputs
    if (!name.trim()) {
      setError("Name is required")
      return
    }

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!validatePassword(password)) {
      setError("Password does not meet the requirements")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      // Map dashboard type to role
      const roleMap: Record<string, string> = {
        admin: 'Admin',
        investor: 'Investor',
        operator: 'Operator'
      }
      
      const role = roleMap[dashboardType]
      
      // Call the signup API
      await signupUser(name, email, password, role as any)
      
      // After signup, login the user
      const userData = await loginUser(email, password)
      
      // Store user data in auth store
      login(userData)
      
      // Show success toast
      toast({
        title: "Account created successfully",
        description: "Welcome to YieldGuru!",
      })
      
      // Redirect to dashboard
      router.push(`/dashboard/${dashboardType}`)
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
      console.error("Signup error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            className="border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            className="border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="h-5 w-5 text-gray-400">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Password requirements</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">{passwordRequirements}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="border-gray-300 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="border-gray-300 pr-10"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full text-white transition-all hover:opacity-90"
          style={{ backgroundColor: accentColor }}
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </motion.div>
  )
}
