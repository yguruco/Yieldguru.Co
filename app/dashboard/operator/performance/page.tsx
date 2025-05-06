import { BarChart, LineChart, TrendingUp, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function OperatorPerformancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground">Track and optimize your EV fleet performance</p>
        </div>
        <Button className="bg-[#f68b27] hover:bg-[#f68b27]/90">
          <TrendingUp className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+4% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Daily Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187 mi</div>
            <p className="text-xs text-muted-foreground">+12 mi from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Charging Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,450</div>
            <p className="text-xs text-muted-foreground">-8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Utilization</CardTitle>
            <CardDescription>Daily utilization percentage</CardDescription>
          </CardHeader>
          <CardContent className="flex h-80 items-center justify-center">
            <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-center">
              <BarChart className="mb-2 h-8 w-8 text-[#f68b27]" />
              <div className="text-2xl font-bold">Utilization Chart</div>
              <div className="text-sm text-muted-foreground">Interactive chart in production</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Performance</CardTitle>
            <CardDescription>Actual vs projected revenue</CardDescription>
          </CardHeader>
          <CardContent className="flex h-80 items-center justify-center">
            <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-center">
              <LineChart className="mb-2 h-8 w-8 text-[#f68b27]" />
              <div className="text-2xl font-bold">Revenue Chart</div>
              <div className="text-sm text-muted-foreground">Interactive chart in production</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Energy Consumption</CardTitle>
          <CardDescription>Vehicle energy efficiency metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {energyData.map((item) => (
              <div key={item.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{item.id}</h3>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Driver: {item.driver} • Last Trip: {item.lastTrip}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-bold">
                      <Zap className="h-4 w-4 text-[#f68b27]" />
                      {item.kwhPerMile} kWh/mile
                    </div>
                    <div className="text-sm text-muted-foreground">{item.efficiency}% efficiency</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>Energy Efficiency</span>
                    <span className="font-medium">{item.efficiency}%</span>
                  </div>
                  <Progress value={item.efficiency} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const energyData = [
  {
    id: "EV-001",
    type: "Sedan",
    driver: "John Smith",
    lastTrip: "Today, 10:23 AM",
    kwhPerMile: 0.28,
    efficiency: 94,
  },
  {
    id: "EV-002",
    type: "SUV",
    driver: "Maria Garcia",
    lastTrip: "Today, 9:45 AM",
    kwhPerMile: 0.32,
    efficiency: 88,
  },
  {
    id: "EV-003",
    type: "Van",
    driver: "Robert Johnson",
    lastTrip: "Yesterday, 5:30 PM",
    kwhPerMile: 0.38,
    efficiency: 82,
  },
  {
    id: "EV-004",
    type: "Sedan",
    driver: "Emily Chen",
    lastTrip: "Today, 11:15 AM",
    kwhPerMile: 0.27,
    efficiency: 96,
  },
  {
    id: "EV-005",
    type: "Bus",
    driver: "Michael Brown",
    lastTrip: "Yesterday, 7:20 PM",
    kwhPerMile: 0.85,
    efficiency: 78,
  },
]
