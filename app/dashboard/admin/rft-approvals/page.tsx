"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Check, X, Eye, User, DollarSign, Calendar, Search, Filter, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { RFTSubmission } from "@/types/rft"


export default function RFTApprovalsPage() {
  const [submissions, setSubmissions] = useState<RFTSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<RFTSubmission[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentFilter, setCurrentFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<RFTSubmission | null>(null)
  const [feedbackComment, setFeedbackComment] = useState("")

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchSubmissions = () => {
      setLoading(true)

      try {
        // Get submissions from local storage (for demo purposes)
        const storedSubmissions = localStorage.getItem("rftSubmissions")
        const parsedSubmissions: RFTSubmission[] = storedSubmissions ? JSON.parse(storedSubmissions) : []

        setSubmissions(parsedSubmissions)
        applyFilters(parsedSubmissions, currentFilter, searchQuery)
      } catch (error) {
        console.error("Error fetching submissions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  const applyFilters = (data: RFTSubmission[], filter: "all" | "pending" | "approved" | "rejected", query: string) => {
    let filtered = [...data]

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((sub) => sub.status === filter)
    }

    // Apply search query
    if (query.trim() !== "") {
      const searchLower = query.toLowerCase()
      filtered = filtered.filter(
        (sub) =>
          sub.vehicleDetails.make.toLowerCase().includes(searchLower) ||
          sub.vehicleDetails.model.toLowerCase().includes(searchLower) ||
          sub.vehicleDetails.ownerName.toLowerCase().includes(searchLower) ||
          sub.vehicleDetails.licensePlate.toLowerCase().includes(searchLower),
      )
    }

    setFilteredSubmissions(filtered)
  }

  const handleFilterChange = (filter: "all" | "pending" | "approved" | "rejected") => {
    setCurrentFilter(filter)
    applyFilters(submissions, filter, searchQuery)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    applyFilters(submissions, currentFilter, query)
  }

  const approveSubmission = (submission: RFTSubmission) => {
    if (!feedbackComment.trim()) {
      alert("Please provide a comment for the approval")
      return
    }

    // Generate a random bytes32 hash (in a real app, this would come from a blockchain transaction)
    const approvalHash = '0x' + Math.random().toString(16).slice(2).padEnd(64, '0')

    // Update the submission
    const updatedSubmission: RFTSubmission = {
      ...submission,
      status: "approved",
      approvalDate: new Date().toISOString(),
      approvalHash,
      feedback: feedbackComment,
    }

    // Update the submissions array
    const updatedSubmissions = submissions.map((sub) =>
      sub.vehicleDetails.id === submission.vehicleDetails.id ? updatedSubmission : sub,
    )

    // Update state and local storage
    setSubmissions(updatedSubmissions)
    applyFilters(updatedSubmissions, currentFilter, searchQuery)
    localStorage.setItem("rftSubmissions", JSON.stringify(updatedSubmissions))

    // Reset feedback
    setFeedbackComment("")

    // Close the dialog
    setSelectedSubmission(null)
  }

  const rejectSubmission = (submission: RFTSubmission) => {
    if (!feedbackComment.trim()) {
      alert("Please provide a reason for the rejection")
      return
    }

    // Update the submission
    const updatedSubmission: RFTSubmission = {
      ...submission,
      status: "rejected",
      approvalDate: new Date().toISOString(),
      feedback: feedbackComment,
    }

    // Update the submissions array
    const updatedSubmissions = submissions.map((sub) =>
      sub.vehicleDetails.id === submission.vehicleDetails.id ? updatedSubmission : sub,
    )

    // Update state and local storage
    setSubmissions(updatedSubmissions)
    applyFilters(updatedSubmissions, currentFilter, searchQuery)
    localStorage.setItem("rftSubmissions", JSON.stringify(updatedSubmissions))

    // Reset feedback
    setFeedbackComment("")

    // Close the dialog
    setSelectedSubmission(null)
  }

  const formatAddress = (addressString: string) => {
    try {
      const addressObj = JSON.parse(addressString)
      return (
        <div className="space-y-1 text-sm">
          <p>{addressObj.streetAddress}</p>
          <p>
            {addressObj.city}, {addressObj.state} {addressObj.zipCode}
          </p>
          <p>{addressObj.country}</p>
          <p className="mt-2 text-xs font-medium text-gray-500">Wallet Address:</p>
          <p className="text-xs font-mono break-all">{addressObj.walletAddress}</p>
        </div>
      )
    } catch (e) {
      return <p className="text-sm text-gray-500">Invalid address format</p>
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4f1964]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">RFT Approvals</h1>
          <p className="text-muted-foreground">Review and approve tokenization requests</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search submissions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all" onClick={() => handleFilterChange("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="pending" onClick={() => handleFilterChange("pending")}>
              Pending
            </TabsTrigger>
            <TabsTrigger value="approved" onClick={() => handleFilterChange("approved")}>
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" onClick={() => handleFilterChange("rejected")}>
              Rejected
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium">No submissions found</h3>
          <p className="text-gray-500 mt-2">
            {submissions.length === 0
              ? "There are no RFT submissions to review."
              : "No submissions match your search criteria. Try a different search term or filter."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubmissions.map((submission, index) => {
            const vehicleDetails = submission.vehicleDetails
            const vehicleName = `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`

            return (
              <motion.div
                key={vehicleDetails.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className={
                    submission.status === "approved"
                      ? "border-green-500"
                      : submission.status === "rejected"
                        ? "border-red-500"
                        : "border-yellow-500"
                  }
                >
                  <div className="relative h-48">
                    <Image
                      src={submission.vehicleImages[0] || "/placeholder.svg?height=200&width=300"}
                      alt={vehicleName}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        className={
                          submission.status === "approved"
                            ? "bg-green-500"
                            : submission.status === "rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }
                      >
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle>{vehicleName}</CardTitle>
                    <CardDescription>
                      {submission.status === "pending"
                        ? "Awaiting your approval"
                        : submission.status === "approved"
                          ? "Asset successfully tokenized"
                          : "Submission was rejected"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{vehicleDetails.ownerName}</span>
                      </div>

                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">${vehicleDetails.value}</span>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">
                          Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                        </span>
                      </div>

                      {submission.feedback && (
                        <div className="flex items-start mt-2 pt-2 border-t border-gray-100">
                          <MessageSquare className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Feedback:</p>
                            <p className="text-sm">{submission.feedback}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1" onClick={() => setSelectedSubmission(submission)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        {selectedSubmission && (
                          <>
                            <DialogHeader>
                              <DialogTitle>RFT Submission Details</DialogTitle>
                              <DialogDescription>Review the complete submission information</DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-6 py-4 md:grid-cols-2">
                              <div>
                                <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
                                <div className="space-y-2">
                                  {Object.entries(selectedSubmission.vehicleDetails).map(([key, value]) => {
                                    if (key === "id" || key === "ownerAddress") return null
                                    return (
                                      <div key={key} className="grid grid-cols-2 gap-2">
                                        <span className="font-medium capitalize">
                                          {key.replace(/([A-Z])/g, " $1").trim()}:
                                        </span>
                                        <span>{value as string}</span>
                                      </div>
                                    )
                                  })}
                                </div>

                                <h3 className="text-lg font-medium mt-6 mb-4">Facial Scan</h3>
                                <div className="border rounded-md overflow-hidden">
                                  {selectedSubmission.facialScanData ? (
                                    <Image
                                      src={selectedSubmission.facialScanData || "/placeholder.svg"}
                                      alt="Facial Scan"
                                      width={400}
                                      height={300}
                                      className="w-full h-auto"
                                    />
                                  ) : (
                                    <div className="bg-gray-100 h-48 flex items-center justify-center">
                                      <p className="text-gray-500">No facial scan provided</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h3 className="text-lg font-medium mb-4">Vehicle Images</h3>
                                <div className="grid grid-cols-2 gap-2">
                                  {selectedSubmission.vehicleImages.length > 0 ? (
                                    selectedSubmission.vehicleImages.map((image, idx) => (
                                      <div key={idx} className="border rounded-md overflow-hidden">
                                        <Image
                                          src={image || "/placeholder.svg"}
                                          alt={`Vehicle image ${idx + 1}`}
                                          width={200}
                                          height={150}
                                          className="w-full h-auto"
                                        />
                                      </div>
                                    ))
                                  ) : (
                                    <div className="col-span-2 bg-gray-100 h-32 flex items-center justify-center rounded-md">
                                      <p className="text-gray-500">No images provided</p>
                                    </div>
                                  )}
                                </div>

                                <h3 className="text-lg font-medium mt-6 mb-4">Operator Address</h3>
                                <div className="border rounded-md p-3 bg-gray-50">
                                  {formatAddress(selectedSubmission.operatorAddress)}
                                </div>

                                <h3 className="text-lg font-medium mt-6 mb-4">Submission Status</h3>
                                <div className="flex items-center">
                                  <Badge
                                    className={
                                      selectedSubmission.status === "approved"
                                        ? "bg-green-500"
                                        : selectedSubmission.status === "rejected"
                                          ? "bg-red-500"
                                          : "bg-yellow-500"
                                    }
                                  >
                                    {selectedSubmission.status.charAt(0).toUpperCase() +
                                      selectedSubmission.status.slice(1)}
                                  </Badge>
                                  <span className="ml-2 text-sm">
                                    {selectedSubmission.status === "pending"
                                      ? "Awaiting your approval"
                                      : selectedSubmission.status === "approved"
                                        ? `Approved on ${new Date(selectedSubmission.approvalDate!).toLocaleDateString()}`
                                        : `Rejected on ${new Date(selectedSubmission.approvalDate!).toLocaleDateString()}`}
                                  </span>
                                </div>

                                {selectedSubmission.approvalHash && (
                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium mb-1">Approval Hash:</h4>
                                    <div className="border rounded-md p-3 bg-gray-50">
                                      <p className="text-sm break-all font-mono">{selectedSubmission.approvalHash}</p>
                                    </div>
                                  </div>
                                )}

                                {selectedSubmission.feedback && (
                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium mb-1">Feedback:</h4>
                                    <div className="border rounded-md p-3 bg-gray-50">
                                      <p className="text-sm">{selectedSubmission.feedback}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {selectedSubmission.status === "pending" && (
                              <>
                                <div className="mt-4">
                                  <h3 className="text-md font-medium mb-2">Add Feedback Comment</h3>
                                  <Textarea
                                    placeholder="Enter your feedback or reason for approval/rejection..."
                                    value={feedbackComment}
                                    onChange={(e) => setFeedbackComment(e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                </div>

                                <DialogFooter className="mt-4">
                                  <div className="flex gap-2 w-full">
                                    <Button
                                      variant="outline"
                                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                      onClick={() => rejectSubmission(selectedSubmission)}
                                    >
                                      <X className="mr-2 h-4 w-4" />
                                      Reject
                                    </Button>
                                    <Button
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                      onClick={() => approveSubmission(selectedSubmission)}
                                    >
                                      <Check className="mr-2 h-4 w-4" />
                                      Approve
                                    </Button>
                                  </div>
                                </DialogFooter>
                              </>
                            )}
                          </>
                        )}
                      </DialogContent>
                    </Dialog>

                    {submission.status === "pending" && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => {
                                setSelectedSubmission(submission)
                                setFeedbackComment("")
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            {selectedSubmission && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>Reject Submission</DialogTitle>
                                  <DialogDescription>
                                    Please provide a reason for rejecting this submission
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="py-4">
                                  <Textarea
                                    placeholder="Enter your feedback or reason for rejection..."
                                    value={feedbackComment}
                                    onChange={(e) => setFeedbackComment(e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                </div>

                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => rejectSubmission(selectedSubmission)}
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Confirm Rejection
                                  </Button>
                                </DialogFooter>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                setSelectedSubmission(submission)
                                setFeedbackComment("")
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            {selectedSubmission && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>Approve Submission</DialogTitle>
                                  <DialogDescription>Please provide any feedback for the approval</DialogDescription>
                                </DialogHeader>

                                <div className="py-4">
                                  <Textarea
                                    placeholder="Enter your feedback for the approval (optional)..."
                                    value={feedbackComment}
                                    onChange={(e) => setFeedbackComment(e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                </div>

                                <DialogFooter>
                                  <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => approveSubmission(selectedSubmission)}
                                  >
                                    <Check className="mr-2 h-4 w-4" />
                                    Confirm Approval
                                  </Button>
                                </DialogFooter>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
