import { Plus, Battery, MapPin, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function OperatorFleetPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-muted-foreground">Monitor and manage your EV fleet</p>
        </div>
        <Button className="bg-[#f68b27] hover:bg-[#f68b27]/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">+7% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42/45</div>
            <p className="text-xs text-muted-foreground">93.3% operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Battery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+3% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$16,000</div>
            <p className="text-xs text-muted-foreground">+5.3% from projected</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Status</CardTitle>
          <CardDescription>Current status of your EV fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{vehicle.id}</h3>
                      <Badge variant="outline">{vehicle.type}</Badge>
                      <Badge
                        className={
                          vehicle.status === "Active"
                            ? "bg-green-500"
                            : vehicle.status === "Charging"
                              ? "bg-blue-500"
                              : vehicle.status === "Maintenance"
                                ? "bg-orange-500"
                                : "bg-red-500"
                        }
                      >
                        {vehicle.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{vehicle.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Last Maintenance: {vehicle.lastMaintenance}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full items-center gap-2 sm:w-48">
                    <Battery className="h-4 w-4" />
                    <span className="text-sm">{vehicle.battery}%</span>
                    <Progress
                      value={vehicle.battery}
                      className={
                        vehicle.battery > 70 ? "bg-green-500" : vehicle.battery > 30 ? "bg-yellow-500" : "bg-red-500"
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const vehicles = [
  {
    id: "EV-001",
    type: "Sedan",
    battery: 85,
    status: "Active",
    location: "Downtown",
    lastMaintenance: "2023-04-15",
  },
  {
    id: "EV-002",
    type: "SUV",
    battery: 62,
    status: "Active",
    location: "Airport",
    lastMaintenance: "2023-05-02",
  },
  {
    id: "EV-003",
    type: "Van",
    battery: 28,
    status: "Charging",
    location: "Depot",
    lastMaintenance: "2023-04-28",
  },
  {
    id: "EV-004",
    type: "Sedan",
    battery: 92,
    status: "Active",
    location: "Suburban",
    lastMaintenance: "2023-05-10",
  },
  {
    id: "EV-005",
    type: "Bus",
    battery: 45,
    status: "Maintenance",
    location: "Service Center",
    lastMaintenance: "2023-05-15",
  },
]
