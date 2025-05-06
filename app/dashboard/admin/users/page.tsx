"use client"

import { Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatCard } from "@/components/ui/stat-card"
import { StatusBadge } from "@/components/ui/status-badge"

// Add the import for the user store
import { useUserStore } from "@/lib/user-store"

// Replace the static users array with the user store
export default function AdminUsersPage() {
  // Use the user store to get users
  const users = useUserStore((state) => state.users)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage platform users and their permissions</p>
        </div>
        <Button className="bg-[#4f1964] hover:bg-[#4f1964]/90">
          <Users className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Users"
          value={users.length.toString()}
          description={`${users.filter((u) => u.status === "Active").length} active users`}
        />
        <StatCard
          title="Active Investors"
          value={users.filter((u) => u.role === "Investor" && u.status === "Active").length.toString()}
          description="Investment accounts"
          delay={0.1}
        />
        <StatCard
          title="EV Operators"
          value={users.filter((u) => u.role === "Operator" && u.status === "Active").length.toString()}
          description="Fleet operators"
          delay={0.2}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>Manage all users on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {user.role === "Admin" && <div className="mr-2 h-4 w-4 rounded-full bg-[#4f1964]" />}
                      {user.role}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status as any} />
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
