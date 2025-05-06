import { notFound } from "next/navigation"
import AdminDashboard from "@/components/dashboards/admin-dashboard"
import InvestorDashboard from "@/components/dashboards/investor-dashboard"
import OperatorDashboard from "@/components/dashboards/operator-dashboard"

export default function DashboardPage({ params }: { params: { type: string } }) {
  const { type } = params

  // Validate dashboard type
  if (!["admin", "investor", "operator"].includes(type)) {
    notFound()
  }

  // Return the appropriate dashboard component based on type
  if (type === "admin") {
    return <AdminDashboard />
  } else if (type === "investor") {
    return <InvestorDashboard />
  } else {
    return <OperatorDashboard />
  }
}
