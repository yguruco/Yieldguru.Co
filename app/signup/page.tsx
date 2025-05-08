import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import SignupForm from "@/components/signup-form"

export default function SignupPage() {
  // Define the password requirements
  const passwordRequirements = "Must be at least 8 characters with one special character and one uppercase letter"

  // Define the accent color
  const accentColor = "#4f1964" // Purple color

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="container mx-auto flex max-w-screen-xl flex-1 items-center px-4 py-8">
        <div className="mx-auto grid w-full max-w-5xl gap-8 rounded-xl bg-white p-4 shadow-lg md:grid-cols-2 md:p-8">
          {/* Left column - Form */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <Link
                href="/"
                className="mb-8 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Create Your Account</h1>
              <p className="mt-2 text-gray-600">
                Join Yieldguru and start your journey in EV tokenization.
              </p>
            </div>

            <SignupForm accentColor={accentColor} passwordRequirements={passwordRequirements} />

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login/investor" className="font-medium text-[#4f1964] hover:underline">
                Sign in
              </Link>
            </div>
          </div>

          {/* Right column - Image and info */}
          <div className="hidden flex-col justify-center space-y-6 rounded-xl bg-gradient-to-br from-[#4f1964] to-[#7b2e9e] p-8 text-white md:flex">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <Image src="/images/YG LOGO.png" alt="Yieldguru Logo" width={60} height={60} />
            </div>
            <h2 className="text-2xl font-bold">Welcome to Yieldguru</h2>
            <p>
              The premier platform for EV tokenization, connecting investors with sustainable transportation
              opportunities.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  className="mr-2 h-5 w-5 flex-shrink-0 text-[#fbdc3e]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Access to exclusive investment opportunities</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mr-2 h-5 w-5 flex-shrink-0 text-[#fbdc3e]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Real-time tracking of your investments</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mr-2 h-5 w-5 flex-shrink-0 text-[#fbdc3e]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure and transparent blockchain transactions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
