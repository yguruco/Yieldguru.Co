"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Total Assets" value="1,245" description="+12% from last month" />
        <StatCard title="Active Investors" value="867" description="+5% from last month" />
        <StatCard title="Total Value Locked" value="$24.5M" description="+18% from last month" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Asset Management
              <Button size="sm" className="bg-[#4f1964] hover:bg-[#4f1964]/90">
                View All <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AssetStatusItem name="Electric Bus Fleet" status="Active" value="$450,000" />
              <AssetStatusItem name="Delivery Van" status="Active" value="$85,000" />
              <AssetStatusItem name="Taxi Fleet" status="Pending" value="$320,000" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activities
              <Button size="sm" className="bg-[#4f1964] hover:bg-[#4f1964]/90">
                View All <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem 
                action="New Investment" 
                description="User invested $25,000 in Taxi Fleet" 
                time="2 hours ago" 
              />
              <ActivityItem 
                action="Loan Repayment" 
                description="$12,500 repaid for Electric Bus Fleet" 
                time="5 hours ago" 
              />
              <ActivityItem 
                action="New Loan Created" 
                description="Commercial Van loan created" 
                time="Yesterday" 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  description: string
}

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

interface AssetStatusItemProps {
  name: string
  status: string
  value: string
}

function AssetStatusItem({ name, status, value }: AssetStatusItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div>
        <h3 className="font-medium">{name}</h3>
        <div className="text-sm text-muted-foreground">{value}</div>
      </div>
      <div className={`px-2 py-1 text-xs rounded-full ${
        status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
      }`}>
        {status}
      </div>
    </div>
  )
}

interface ActivityItemProps {
  action: string
  description: string
  time: string
}

function ActivityItem({ action, description, time }: ActivityItemProps) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex justify-between">
        <h3 className="font-medium">{action}</h3>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  )
}
