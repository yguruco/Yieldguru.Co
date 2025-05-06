"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Clock, CheckCircle, XCircle, Car, User, DollarSign, Calendar, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { AssetCard, RFTSubmission } from "@/types/rft"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface RFTSubmissionStatusProps {
  status: "pending" | "approved" | "rejected"
}

export function RFTSubmissionStatus({ status }: RFTSubmissionStatusProps) {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<AssetCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchSubmissions = () => {
      setLoading(true)

      try {
        // Get submissions from local storage (for demo purposes)
        const storedSubmissions = localStorage.getItem("rftSubmissions")
        let parsedSubmissions: RFTSubmission[] = storedSubmissions ? JSON.parse(storedSubmissions) : []

        // Filter by status
        parsedSubmissions = parsedSubmissions.filter((sub) => sub.status === status)

        // Convert to asset cards
        const assetCards: AssetCard[] = parsedSubmissions.map((sub) => ({
          id: sub.vehicleDetails.id,
          vehicleName: `${sub.vehicleDetails.year} ${sub.vehicleDetails.make} ${sub.vehicleDetails.model}`,
          vehicleImage: sub.vehicleImages[0] || "/placeholder.svg?height=200&width=300",
          operatorName: sub.vehicleDetails.ownerName,
          vehicleValue: sub.vehicleDetails.value,
          status: sub.status,
          approvalHash: sub.approvalHash,
          submissionDate: sub.submissionDate,
          approvalDate: sub.approvalDate,
          feedback: sub.feedback,
        }))

        setSubmissions(assetCards)
      } catch (error) {
        console.error("Error fetching submissions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [status])

  const handleCreateNew = () => {
    router.push("/dashboard/operator/rft?new=true")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f68b27]"></div>
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          {status === "pending" ? (
            <Clock className="h-8 w-8 text-gray-400" />
          ) : status === "approved" ? (
            <CheckCircle className="h-8 w-8 text-gray-400" />
          ) : (
            <XCircle className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <h3 className="text-lg font-medium">No {status} submissions</h3>
        <p className="text-gray-500 mt-2">
          {status === "pending"
            ? "You don't have any pending submissions. Create a new RFT to get started."
            : status === "approved"
              ? "You don't have any approved assets yet. Submissions are typically reviewed within 48 hours."
              : "You don't have any rejected submissions."}
        </p>
        {status === "pending" && (
          <Button onClick={handleCreateNew} className="mt-4 bg-[#f68b27] hover:bg-[#f68b27]/90">
            Create New RFT
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {submissions.map((submission, index) => (
        <motion.div
          key={submission.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card
            className={
              status === "approved"
                ? "border-green-500"
                : status === "rejected"
                  ? "border-red-500"
                  : "border-yellow-500"
            }
          >
            <div className="relative h-48">
              <Image
                src={submission.vehicleImage || "/placeholder.svg"}
                alt={submission.vehicleName}
                fill
                className="object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2">
                <Badge
                  className={
                    status === "approved" ? "bg-green-500" : status === "rejected" ? "bg-red-500" : "bg-yellow-500"
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>
            </div>

            <CardHeader>
              <CardTitle>{submission.vehicleName}</CardTitle>
              <CardDescription>
                {status === "pending"
                  ? "Awaiting admin approval"
                  : status === "approved"
                    ? "Asset successfully tokenized"
                    : "Submission was rejected"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">{submission.operatorName}</span>
                </div>

                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">${submission.vehicleValue}</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">{new Date(submission.submissionDate).toLocaleDateString()}</span>
                </div>

                {submission.feedback && (
                  <div className="flex items-start mt-2 pt-2 border-t border-gray-100">
                    <MessageSquare className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Admin Feedback:</p>
                      <p className="text-sm">{submission.feedback}</p>
                    </div>
                  </div>
                )}

                {status === "approved" && submission.approvalHash && (
                  <div className="pt-2">
                    <p className="text-xs font-medium text-gray-500 mb-1">Approval Hash:</p>
                    <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">{submission.approvalHash}</div>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter>
              {status === "approved" ? (
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Car className="mr-2 h-4 w-4" />
                  View Asset Details
                </Button>
              ) : status === "pending" ? (
                <Button variant="outline" className="w-full">
                  Check Status
                </Button>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                      View Rejection Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rejection Details</DialogTitle>
                      <DialogDescription>Your submission was rejected for the following reason:</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="bg-red-50 p-4 rounded-md border border-red-200">
                        <p className="text-red-800 font-medium mb-2">Admin Feedback:</p>
                        <p className="text-gray-700">{submission.feedback || "No specific feedback provided."}</p>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Submission Details</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="font-medium">Vehicle:</div>
                          <div>{submission.vehicleName}</div>

                          <div className="font-medium">Submitted on:</div>
                          <div>{new Date(submission.submissionDate).toLocaleDateString()}</div>

                          <div className="font-medium">Rejected on:</div>
                          <div>
                            {submission.approvalDate
                              ? new Date(submission.approvalDate).toLocaleDateString()
                              : "Unknown"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateNew} className="bg-[#f68b27] hover:bg-[#f68b27]/90">
                        Create New Submission
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
