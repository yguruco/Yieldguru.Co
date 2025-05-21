import { notFound } from "next/navigation"
import AdminDashboard from "@/components/dashboards/admin-dashboard"
import InvestorDashboard from "@/components/dashboards/investor-dashboard"
import OperatorDashboard from "@/components/dashboards/operator-dashboard"

// This is a server component
export default async function DashboardPage({ params }: { params: { type: string } }) {
  // Get the dashboard type from the URL - ensure it's properly awaited
  const dashboardType = await Promise.resolve(params.type)

  // Validate dashboard type
  if (!["admin", "investor", "operator"].includes(dashboardType)) {
    notFound()
  }

  // Return the appropriate dashboard component based on type
  if (dashboardType === "admin") {
    return <AdminDashboard />
  } else if (dashboardType === "investor") {
    return <InvestorDashboard />
  } else {
    return <OperatorDashboard />
  }
}
