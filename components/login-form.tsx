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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface LoginFormProps {
  dashboardType: string
  accentColor: string
  passwordRequirements: string
}

export default function LoginForm({ dashboardType, accentColor, passwordRequirements }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const validatePassword = (password: string): boolean => {
    // For generalized login, use a basic validation
    if (dashboardType === "general") {
      // Basic validation: at least 8 characters
      return password.length >= 8
    }
    // Different validation based on dashboard type
    else if (dashboardType === "admin") {
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset error
    setError("")

    if (!validatePassword(password)) {
      setError(`Password does not meet requirements: ${passwordRequirements}`)
      return
    }

    setIsLoading(true)

    try {
      let endpoint = '/api/auth/login';

      // For admin login, use the admin endpoint
      if (dashboardType === "admin") {
        endpoint = '/api/auth/admin';
      }

      // For generalized login, try the regular login endpoint first
      // The server will determine the user's role

      // Call the login API
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      console.log('Login response:', response.status, data)

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Check if auth_token cookie was set
      console.log('Cookies after login:', document.cookie)

      // Determine the dashboard type from the user's role
      let redirectDashboard = dashboardType;

      if (dashboardType === "general" && data.user && data.user.role) {
        // Map the role to the dashboard type
        const roleMap: Record<string, string> = {
          'Admin': 'admin',
          'Investor': 'investor',
          'Operator': 'operator'
        };

        redirectDashboard = roleMap[data.user.role] || 'investor';
      }

      // Redirect to the appropriate dashboard
      router.push(`/dashboard/${redirectDashboard}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
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

        <Button
          type="submit"
          className="w-full text-white transition-all hover:opacity-90"
          style={{ backgroundColor: accentColor }}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </motion.div>
  )
}
