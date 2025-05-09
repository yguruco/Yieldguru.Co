"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save, X, User, Mail, Calendar, Clock, Shield } from "lucide-react"
import { motion } from "framer-motion"

interface UserProfileProps {
  accentColor: string
}

export default function UserProfile({ accentColor }: UserProfileProps) {
  const { user, loading: authLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  })
  const [loading, setLoading] = useState(false)

  // Debug user data
  useEffect(() => {
    console.log("Auth state:", { user, authLoading })
  }, [user, authLoading])

  useEffect(() => {
    if (user) {
      console.log("Setting form data with user:", user)
      setFormData({
        name: user.name || "",
        email: user.email || ""
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real implementation, you would update the user profile here
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update would happen here
      // const response = await fetch('/api/user/profile', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid Date"
    }
  }

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: accentColor }}></div>
        <span className="ml-3 text-gray-600">Loading user data...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="text-red-500 text-xl">User data not available</div>
        <p className="text-gray-600">There was a problem loading your profile. Please try refreshing the page.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information and settings</p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            style={{ backgroundColor: accentColor }}
            className="text-white hover:opacity-90"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: accentColor }}
              className="text-white hover:opacity-90"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4" style={{ borderColor: accentColor }}>
                    <Image
                      src="/images/YG LOGO.png"
                      alt="User Avatar"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <Badge style={{ backgroundColor: accentColor }} className="text-white">
                    {user?.role || "User"}
                  </Badge>
                </div>

                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <form className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid gap-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="mr-2 h-4 w-4" />
                          Full Name
                        </div>
                        <div className="font-medium">{user?.name || "N/A"}</div>
                      </div>
                      <div className="grid gap-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </div>
                        <div className="font-medium">{user?.email || "N/A"}</div>
                      </div>
                      <div className="grid gap-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Shield className="mr-2 h-4 w-4" />
                          Role
                        </div>
                        <div className="font-medium">{user?.role || "N/A"}</div>
                      </div>
                      <div className="grid gap-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          Last Login
                        </div>
                        <div className="font-medium">{user?.lastLogin ? formatDate(user.lastLogin) : "N/A"}</div>
                      </div>
                      <div className="grid gap-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-2 h-4 w-4" />
                          Account Status
                        </div>
                        <div className="font-medium">
                          <Badge variant={user?.status === "Active" ? "success" : "secondary"}>
                            {user?.status || "Unknown"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Security settings will be implemented in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
              <CardDescription>
                Customize your dashboard experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Preference settings will be implemented in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
