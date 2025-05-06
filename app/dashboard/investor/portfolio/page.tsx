import { LineChart, BarChart, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function InvestorPortfolioPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Portfolio</h1>
          <p className="text-muted-foreground">Track and manage your EV asset investments</p>
        </div>
        <Button className="bg-[#fbdc3e] text-[#4f1964] hover:bg-[#fbdc3e]/90">
          <PieChart className="mr-2 h-4 w-4" />
          Portfolio Analysis
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$162,450</div>
            <p className="text-xs text-muted-foreground">+9.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9%</div>
            <p className="text-xs text-muted-foreground">+0.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$662</div>
            <p className="text-xs text-muted-foreground">+$48 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Distribution by asset type</CardDescription>
          </CardHeader>
          <CardContent className="flex h-80 items-center justify-center">
            <div className="flex h-64 w-64 flex-col items-center justify-center rounded-full border-8 border-[#fbdc3e] text-center">
              <LineChart className="mb-2 h-8 w-8 text-[#4f1964]" />
              <div className="text-2xl font-bold">Asset Allocation</div>
              <div className="text-sm text-muted-foreground">Interactive chart in production</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance History</CardTitle>
            <CardDescription>Monthly returns over time</CardDescription>
          </CardHeader>
          <CardContent className="flex h-80 items-center justify-center">
            <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-center">
              <BarChart className="mb-2 h-8 w-8 text-[#4f1964]" />
              <div className="text-2xl font-bold">Performance Chart</div>
              <div className="text-sm text-muted-foreground">Interactive chart in production</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Investments</CardTitle>
          <CardDescription>All your current EV asset investments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.map((investment) => (
              <div key={investment.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{investment.name}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>ID: {investment.id}</span>
                      <span>•</span>
                      <span>Operator: {investment.operator}</span>
                      <Badge
                        className={
                          investment.status === "Active"
                            ? "bg-green-500"
                            : investment.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }
                      >
                        {investment.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${investment.value.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Yield: {investment.yield}%</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>Ownership: {investment.ownership}%</span>
                    <span className="font-medium">${investment.monthlyIncome} monthly</span>
                  </div>
                  <Progress value={investment.ownership} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const investments = [
  {
    id: "EV-001-INV",
    name: "Electric Bus Fleet - MetroTransit",
    operator: "MetroTransit",
    value: 45000,
    yield: 5.2,
    ownership: 10,
    monthlyIncome: 195,
    status: "Active",
  },
  {
    id: "EV-002-INV",
    name: "Delivery Van Network - EcoDelivery",
    operator: "EcoDelivery",
    value: 25500,
    yield: 4.8,
    ownership: 30,
    monthlyIncome: 102,
    status: "Active",
  },
  {
    id: "EV-003-INV",
    name: "Taxi EV Network - GreenCab",
    operator: "GreenCab",
    value: 32000,
    yield: 5.5,
    ownership: 10,
    monthlyIncome: 147,
    status: "Active",
  },
  {
    id: "EV-004-INV",
    name: "Municipal Utility Vehicles",
    operator: "CityServices",
    value: 60000,
    yield: 4.4,
    ownership: 50,
    monthlyIncome: 220,
    status: "Active",
  },
]
