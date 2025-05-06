import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-[#4f1964]/10 p-3">
            <div className="rounded-full bg-[#4f1964]/20 p-4">
              <span className="block text-6xl font-bold text-[#4f1964]">404</span>
            </div>
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">Page not found</h1>

        <p className="mb-8 text-gray-600">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>

        <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button asChild className="bg-[#4f1964] hover:bg-[#4f1964]/90">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
