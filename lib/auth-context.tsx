"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// Define the User type
export interface User {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Investor' | 'Operator'
  status: 'Active' | 'Inactive' | 'Pending'
  lastLogin: string | Date
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, isAdmin?: boolean) => Promise<void>
  signup: (name: string, email: string, password: string, role: 'Investor' | 'Operator') => Promise<void>
  logout: () => Promise<void>
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string, isAdmin = false) => {
    setLoading(true)
    try {
      const endpoint = isAdmin ? '/api/auth/admin' : '/api/auth/login'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      }

      const data = await response.json()
      setUser(data.user)

      // Redirect based on user role
      const dashboardType = data.user.role === 'Admin' 
        ? 'admin' 
        : data.user.role === 'Investor' 
          ? 'investor' 
          : 'operator'
      
      router.push(`/dashboard/${dashboardType}`)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Signup function
  const signup = async (name: string, email: string, password: string, role: 'Investor' | 'Operator') => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Signup failed')
      }

      const data = await response.json()
      setUser(data.user)

      // Redirect based on user role
      const dashboardType = role === 'Investor' ? 'investor' : 'operator'
      router.push(`/dashboard/${dashboardType}`)
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
