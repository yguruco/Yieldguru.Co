"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"

export default function OperatorDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">EV-Operator Dashboard</h1>
        <p className="text-muted-foreground">Monitor your EV fleet</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Fleet Value"
          value="$1.2M"
          description="Total value of EV loans"
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
          title="Tokenization Rate"
          value="68%"
          description="Percentage of vehicles with tokenized EV loans"
          trend="up"
          trendValue="5%"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fleet Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-2 border-gray-100">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Vehicle #{i}</div>
                    <div className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</div>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Battery:</span>
                      <span>{85 + (i % 10)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span>In Service</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
