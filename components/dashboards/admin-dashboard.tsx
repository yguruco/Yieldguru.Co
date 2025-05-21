"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Assets"
          value="1,245"
          description="+12% from last month"
          trend="up"
          trendValue="12%"
          className="animate-fade-in-up"
        />
        <StatCard
          title="Active Investors"
          value="867"
          description="+5% from last month"
          trend="up"
          trendValue="5%"
          className="animate-fade-in-up animation-delay-100"
        />
        <StatCard
          title="Total Value Locked"
          value="$24.5M"
          description="+18% from last month"
          trend="up"
          trendValue="18%"
          className="animate-fade-in-up animation-delay-200"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="animate-fade-in-up animation-delay-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Asset Management
              <Button
                size="sm"
                className="bg-[#4f1964] hover:bg-[#4f1964]/90 transition-all duration-300 hover:shadow-md"
              >
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

        <Card className="animate-fade-in-up animation-delay-400">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activities
              <Button
                size="sm"
                className="bg-[#4f1964] hover:bg-[#4f1964]/90 transition-all duration-300 hover:shadow-md"
              >
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
    <div className="flex items-center justify-between rounded-lg border p-4 hover:shadow-sm transition-all duration-300 hover:border-gray-300 group">
      <div>
        <h3 className="font-medium group-hover:text-[#4f1964] transition-colors">{name}</h3>
        <div className="text-sm text-muted-foreground">{value}</div>
      </div>
      <div className={`px-3 py-1 text-xs rounded-full font-medium transition-all duration-300 ${
        status === "Active"
          ? "bg-green-100 text-green-800 group-hover:bg-green-200"
          : "bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200"
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
    <div className="rounded-lg border p-4 hover:shadow-sm transition-all duration-300 hover:border-gray-300 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#4f1964]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      <div className="flex justify-between">
        <h3 className="font-medium group-hover:text-[#4f1964] transition-colors">{action}</h3>
        <span className="text-xs text-muted-foreground bg-gray-50 px-2 py-0.5 rounded-full">{time}</span>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  )
}
