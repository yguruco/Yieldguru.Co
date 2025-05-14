"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RFTApprovalsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/admin/rfl-approvals")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
        <p className="text-muted-foreground">
          The RFT Approvals page has been replaced with RFL Approvals (Request for Loan).
        </p>
      </div>
    </div>
  )
}
