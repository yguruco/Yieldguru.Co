import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"
import  ConnectButton  from "../../../reown-appkit/ConnectButton"
import Link from "next/link"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage tokenized EV loans platform</p>
      </div>
      {/* <ConnectButton /> */}
      
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Total Assets" value="1,245" description="+12% from last month" />
        <StatCard title="Active Investors" value="867" description="+5% from last month" />
        <StatCard title="Total Value Locked" value="$24.5M" description="+18% from last month" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/dashboard/admin/assets" className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Manage Assets <ArrowUpRight className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View and manage all tokenized EV loans on the platform</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/dashboard/admin/create-loan" className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Create New Loan <ArrowUpRight className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Create new tokenized EV loans on the platform</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
