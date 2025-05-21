import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import UnifiedLoginForm from "@/components/unified-login-form"

export default function UnifiedLoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="h-2 bg-gradient-to-r from-[#4f1964] via-[#fbdc3e] to-[#f68b27]" />

      <div className="container mx-auto flex max-w-md flex-1 flex-col px-4 py-12">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-[#4f1964]">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to access your YieldGuru dashboard</p>
        </div>

        <UnifiedLoginForm />

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="font-medium text-[#4f1964]">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
