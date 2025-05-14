"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartPlaceholder } from "@/components/dashboard/chart-placeholder"

export default function OperatorDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">EV-Operator Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage your EV fleet performance</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Fleet Value"
              value="$1.2M"
              description="Total value of tokenized fleet"
              trend="up"
              trendValue="12%"
            />
            <StatCard
              title="Active Vehicles"
              value="24"
              description="Vehicles currently in operation"
              trend="up"
              trendValue="2"
            />
            <StatCard
              title="Monthly Revenue"
              value="$85.4K"
              description="Revenue generated this month"
              trend="up"
              trendValue="8.2%"
            />
            <StatCard
              title="Tokenization Rate"
              value="68%"
              description="Percentage of fleet tokenized"
              trend="up"
              trendValue="5%"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fleet Performance</CardTitle>
                <CardDescription>Daily performance metrics for your fleet</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder height={300} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue sources by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder height={300} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fleet Status</CardTitle>
              <CardDescription>Current status of your vehicle fleet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Fleet status visualization will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Detailed performance analytics for your fleet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground">Performance analytics will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
