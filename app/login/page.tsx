import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import LoginForm from "@/components/login-form"

export default function LoginPage() {
  // Default color and password requirements
  const accentColor = "#4f1964" // Purple color
  const passwordRequirements = "Enter your password to access your account"
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="h-2" style={{ backgroundColor: accentColor }} />

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
          <h1 className="mb-2 text-3xl font-bold" style={{ color: accentColor }}>
            Account Login
          </h1>
          <p className="text-gray-600">Sign in to access your YieldGuru dashboard</p>
        </div>

        <LoginForm
          dashboardType="general"
          accentColor={accentColor}
          passwordRequirements={passwordRequirements}
        />

        <div className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium hover:underline" style={{ color: accentColor }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
