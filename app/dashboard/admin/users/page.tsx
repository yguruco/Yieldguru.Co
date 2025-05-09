"use client"

import { useState, useEffect } from "react"
import { Users, RefreshCw, UserPlus, Shield, UserCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/ui/status-badge"
import { motion } from "framer-motion"
import GlassmorphicCard from "@/components/dashboard/glassmorphic-card"
import NeumorphicStatCard from "@/components/dashboard/neumorphic-stat-card"

interface User {
  _id: string
  name: string
  email: string
  role: "Admin" | "Investor" | "Operator"
  status: "Active" | "Inactive" | "Pending"
  lastLogin: string
  createdAt: string
  updatedAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const accentColor = "#4f1964"

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/users')

      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.status}`)
      }

      const data = await response.json()
      setUsers(data)
    } catch (err) {
      console.error("Failed to fetch users:", err)
      setError("Failed to load users. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(',', '')
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
                boxShadow: `0 3px 10px ${accentColor}40`
              }}
            >
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight shimmer">User Management</h1>
          </div>
          <p className="text-muted-foreground">Manage platform users and their permissions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-1 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            className="rounded-full shadow-sm hover:shadow-md transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`,
              boxShadow: `0 3px 10px ${accentColor}40`
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Total Users"
            value={users.length.toString()}
            description={`${users.filter((u) => u.status === "Active").length} active users`}
            trend="up"
            trendValue="8%"
            icon={<Users className="h-5 w-5 text-[#4f1964]" />}
            accentColor={accentColor}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Active Investors"
            value={users.filter((u) => u.role === "Investor" && u.status === "Active").length.toString()}
            description="Investment accounts"
            trend="up"
            trendValue="5%"
            icon={<UserCircle className="h-5 w-5 text-[#4f1964]" />}
            accentColor={accentColor}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="EV Operators"
            value={users.filter((u) => u.role === "Operator" && u.status === "Active").length.toString()}
            description="Fleet operators"
            trend="up"
            trendValue="12%"
            icon={<Shield className="h-5 w-5 text-[#4f1964]" />}
            accentColor={accentColor}
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <GlassmorphicCard
          title="User List"
          description="Manage all users on the platform"
          accentColor={accentColor}
        >
          {error && (
            <div className="bg-red-50 text-red-500 p-4 mx-4 mt-2 mb-4 rounded-md border border-red-100">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: accentColor }}></div>
            </div>
          ) : (
            <div className="p-4">
              <div className="bg-white/80 rounded-xl overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150"
                      >
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div
                              className="mr-2 h-4 w-4 rounded-full"
                              style={{
                                backgroundColor: user.role === "Admin"
                                  ? accentColor
                                  : user.role === "Investor"
                                    ? "#fbdc3e"
                                    : "#f68b27"
                              }}
                            />
                            {user.role}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={user.status as any} />
                        </TableCell>
                        <TableCell>{formatDate(user.lastLogin)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full hover:bg-gray-100/80 transition-all duration-300"
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </GlassmorphicCard>
      </motion.div>
    </motion.div>
  )
}
