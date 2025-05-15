"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RFTRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/operator/rfl")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
        <p className="text-muted-foreground">
          The Request for Tokenization (RFT) page has been replaced with Request for Loan (RFL).
        </p>
      </div>
    </div>
  )
}
