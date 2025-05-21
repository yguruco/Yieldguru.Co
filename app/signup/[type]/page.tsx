import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import SignupForm from "@/components/signup-form"

export default function SignupPage({ params }: { params: { type: string } }) {
  const { type } = params

  // Validate dashboard type - only allow investor and operator signups
  if (!["investor", "operator"].includes(type)) {
    notFound()
  }

  const dashboardInfo = {
    admin: {
      title: "Admin Registration",
      description: "Create an admin account for platform management",
      color: "#4f1964",
      passwordRequirements: "Must contain at least one uppercase letter, one number, and one special character",
    },
    investor: {
      title: "Investor Registration",
      description: "Create an investor account to manage your portfolio",
      color: "#fbdc3e",
      passwordRequirements: "Must be at least 10 characters with one lowercase letter and one number",
    },
    operator: {
      title: "EV-Operator Registration",
      description: "Create an operator account to manage your EV assets",
      color: "#f68b27",
      passwordRequirements: "Must contain at least 8 characters with one special character and one uppercase letter",
    },
  }[type]

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="h-2" style={{ backgroundColor: dashboardInfo.color }} />

      <div className="container mx-auto flex max-w-md flex-1 flex-col px-4 py-12">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold" style={{ color: dashboardInfo.color }}>
            {dashboardInfo.title}
          </h1>
          <p className="text-gray-600">{dashboardInfo.description}</p>
        </div>

        <SignupForm
          dashboardType={type}
          accentColor={dashboardInfo.color}
          passwordRequirements={dashboardInfo.passwordRequirements}
        />

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href={`/login/${type}`} className="font-medium" style={{ color: dashboardInfo.color }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
