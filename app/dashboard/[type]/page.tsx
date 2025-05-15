import { notFound } from "next/navigation"
import AdminDashboard from "@/components/dashboards/admin-dashboard"
import InvestorDashboard from "@/components/dashboards/investor-dashboard"
import OperatorDashboard from "@/components/dashboards/operator-dashboard"

// Define valid dashboard types
const validDashboardTypes = ["admin", "investor", "operator"]

// Generate static params for all valid dashboard types
export function generateStaticParams() {
  return validDashboardTypes.map(type => ({ type }))
}

// Define the page component
export default function DashboardPage(props: { params: { type: string } }) {
  // Get the dashboard type from the URL params
  const type = props.params.type

  // Validate dashboard type
  if (!validDashboardTypes.includes(type)) {
    return notFound()
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
