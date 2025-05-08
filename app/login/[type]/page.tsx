import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import LoginForm from "@/components/login-form"

export default function LoginPage({ params }: { params: { type: string } }) {
  const { type } = params

  // Validate dashboard type
  if (!["admin", "investor", "operator"].includes(type)) {
    notFound()
  }

  const dashboardInfo = {
    admin: {
      title: "Admin Dashboard",
      description: "Access the platform administration tools",
      color: "#4f1964",
      passwordRequirements: "Must contain at least one uppercase letter, one number, and one special character",
    },
    investor: {
      title: "Investor Dashboard",
      description: "Manage your investment portfolio",
      color: "#fbdc3e",
      passwordRequirements: "Must be at least 10 characters with one lowercase letter and one number",
    },
    operator: {
      title: "EV-Operator Dashboard",
      description: "Monitor and manage your EV assets",
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
          <div className="flex justify-center mb-4">
            <div className="relative h-16 w-16 overflow-hidden">
              <Image
                src="/images/YG LOGO.png"
                alt="YieldGuru Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold" style={{ color: dashboardInfo.color }}>
            {dashboardInfo.title}
          </h1>
          <p className="text-gray-600">{dashboardInfo.description}</p>
        </div>

        <LoginForm
          dashboardType={type}
          accentColor={dashboardInfo.color}
          passwordRequirements={dashboardInfo.passwordRequirements}
        />
      </div>
    </div>
  )
}
