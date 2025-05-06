import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartPlaceholder } from "@/components/dashboard/chart-placeholder"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Total Assets" value="1,245" description="+12% from last month" />
        <StatCard title="Active Investors" value="867" description="+5% from last month" delay={0.1} />
        <StatCard title="Total Value Locked" value="$24.5M" description="+18% from last month" delay={0.2} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asset Distribution</CardTitle>
            <CardDescription>Breakdown of tokenized EV assets by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder
              type="pie"
              title="Asset Distribution"
              description="Breakdown by vehicle type"
              accentColor="#4f1964"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tokenization Growth</CardTitle>
            <CardDescription>Monthly tokenization volume in thousands</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder
              type="bar"
              title="Monthly Growth"
              description="Volume in thousands"
              accentColor="#4f1964"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
