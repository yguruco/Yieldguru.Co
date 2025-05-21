"use client"

import { useEffect, useState } from "react"
import { Clock, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import type { RFLSubmission } from "@/types/rfl"

interface RFLSubmissionStatusProps {
  status: "pending" | "approved" | "rejected"
}

export function RFLSubmissionStatus({ status }: RFLSubmissionStatusProps) {
  const [submissions, setSubmissions] = useState<RFLSubmission[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      try {
        const storedSubmissions = JSON.parse(localStorage.getItem("rflSubmissions") || "[]")
        const filteredSubmissions = storedSubmissions.filter(
          (sub: RFLSubmission) => sub.status === status
        )
        setSubmissions(filteredSubmissions)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading submissions:", error)
        setSubmissions([])
        setIsLoading(false)
      }
    }, 1000)
  }, [status])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-amber-500 border-amber-500">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-green-500 border-green-500">
            <CheckCircle2 className="h-3 w-3" /> Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-red-500 border-red-500">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (!submissions || submissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Submissions</CardTitle>
          <CardDescription>
            {status === "pending"
              ? "You don't have any pending loan applications."
              : status === "approved"
              ? "You don't have any approved loan applications."
              : "You don't have any rejected loan applications."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {status === "pending"
              ? "Submit a new loan application to see it here."
              : "Your loan applications will appear here once they've been processed."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card key={submission.applicantDetails.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{submission.applicantDetails.name}</CardTitle>
                <CardDescription>Submitted on {formatDate(submission.submissionDate)}</CardDescription>
              </div>
              <div>{getStatusBadge(submission.status)}</div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Contact Info</p>
                <p className="text-sm text-muted-foreground">
                  {submission.applicantDetails.telephone} | {submission.applicantDetails.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Financing Requested</p>
                <p className="text-sm text-muted-foreground">
                  KSH {submission.applicantDetails.totalFinancingRequested}
                </p>
              </div>
            </div>

            <div className="mt-2 text-xs text-muted-foreground break-all">
              <span className="font-medium">Wallet Address:</span> {submission.applicantDetails.walletAddress}
            </div>

            {submission.applicantDetails.additionalNotes && (
              <div className="mt-3 border-t pt-3">
                <p className="text-sm font-medium">Additional Notes</p>
                <p className="text-sm text-muted-foreground">
                  {submission.applicantDetails.additionalNotes}
                </p>
              </div>
            )}

            {status === "pending" && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Application under review</span>
                  <span className="text-xs text-muted-foreground">Estimated: 2-3 business days</span>
                </div>
                <Progress value={33} className="h-2" />
              </div>
            )}

            {status === "rejected" && submission.feedback && (
              <div className="mt-4 p-3 border rounded-md bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-800 dark:text-red-400">Feedback:</p>
                <p className="text-sm text-red-700 dark:text-red-300">{submission.feedback}</p>
              </div>
            )}

            {status === "approved" && (
              <div className="mt-4 p-3 border rounded-md bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-400">
                  Approved on {submission.approvalDate ? formatDate(submission.approvalDate) : "N/A"}
                </p>
                {submission.approvalHash && (
                  <p className="text-xs text-green-700 dark:text-green-300 truncate">
                    Transaction: {submission.approvalHash}
                  </p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // View details action
                console.log("View details for:", submission.applicantDetails.id)
              }}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 