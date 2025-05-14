"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { 
  Check, 
  Clock, 
  Search, 
  X, 
  CheckCircle, 
  XCircle,
  ArrowUpDown,
  User,
  Calendar,
  DollarSign,
  Info
} from "lucide-react"
import type { RFLSubmission } from "@/types/rfl"

export default function RFLApprovalsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [submissions, setSubmissions] = useState<RFLSubmission[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    // Simulate API call to get submissions
    setTimeout(() => {
      try {
        const storedSubmissions = JSON.parse(localStorage.getItem("rflSubmissions") || "[]")
        setSubmissions(storedSubmissions)
      } catch (error) {
        console.error("Error loading submissions:", error)
        setSubmissions([])
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }, [])

  const approveSubmission = (id: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.applicantDetails.id === id) {
          return {
            ...sub,
            status: "approved",
            approvalDate: new Date().toISOString(),
            approvalHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
          }
        }
        return sub
      })
    )

    // Update in localStorage
    const storedSubmissions = JSON.parse(localStorage.getItem("rflSubmissions") || "[]")
    const updatedSubmissions = storedSubmissions.map((sub: RFLSubmission) => {
      if (sub.applicantDetails.id === id) {
        return {
          ...sub,
          status: "approved",
          approvalDate: new Date().toISOString(),
          approvalHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
        }
      }
      return sub
    })
    localStorage.setItem("rflSubmissions", JSON.stringify(updatedSubmissions))
  }

  const rejectSubmission = (id: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.applicantDetails.id === id) {
          return {
            ...sub,
            status: "rejected",
            approvalDate: new Date().toISOString(),
            feedback: "Application does not meet our current financing criteria.",
          }
        }
        return sub
      })
    )

    // Update in localStorage
    const storedSubmissions = JSON.parse(localStorage.getItem("rflSubmissions") || "[]")
    const updatedSubmissions = storedSubmissions.map((sub: RFLSubmission) => {
      if (sub.applicantDetails.id === id) {
        return {
          ...sub,
          status: "rejected",
          approvalDate: new Date().toISOString(),
          feedback: "Application does not meet our current financing criteria.",
        }
      }
      return sub
    })
    localStorage.setItem("rflSubmissions", JSON.stringify(updatedSubmissions))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const filteredSubmissions = submissions.filter((sub) => {
    const searchTerms = searchQuery.toLowerCase().split(" ")
    const applicantName = sub.applicantDetails.name.toLowerCase()
    const applicantEmail = sub.applicantDetails.email.toLowerCase()
    const applicantId = sub.applicantDetails.idNumber.toLowerCase()
    
    return searchTerms.every(term => 
      applicantName.includes(term) || 
      applicantEmail.includes(term) || 
      applicantId.includes(term)
    )
  })

  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    const dateA = new Date(a.submissionDate).getTime()
    const dateB = new Date(b.submissionDate).getTime()
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA
  })

  const pendingSubmissions = sortedSubmissions.filter((sub) => sub.status === "pending")
  const approvedSubmissions = sortedSubmissions.filter((sub) => sub.status === "approved")
  const rejectedSubmissions = sortedSubmissions.filter((sub) => sub.status === "rejected")

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">RFL Approvals</h1>
          <p className="text-muted-foreground">Review and approve loan applications</p>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 w-full">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">RFL Approvals</h1>
        <p className="text-muted-foreground">Review and approve loan applications</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, or ID..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={toggleSortOrder}>
          <Calendar className="mr-2 h-4 w-4" />
          Date {sortOrder === "asc" ? "Oldest first" : "Newest first"}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingSubmissions.length > 0 && (
              <Badge variant="secondary" className="ml-2 px-2 py-0 h-5">
                {pendingSubmissions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingSubmissions.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Pending Applications</CardTitle>
                <CardDescription>
                  There are currently no loan applications waiting for your approval.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            pendingSubmissions.map((submission) => (
              <Card key={submission.applicantDetails.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        {submission.facialScanData ? (
                          <AvatarImage src={submission.facialScanData} alt={submission.applicantDetails.name} />
                        ) : (
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{submission.applicantDetails.name}</CardTitle>
                        <CardDescription>
                          {submission.applicantDetails.email} | ID: {submission.applicantDetails.idNumber}
                        </CardDescription>
                        <p className="text-xs text-muted-foreground mt-1">
                          Application ID: <span className="font-mono">{submission.applicantDetails.id}</span>
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Submitted {formatDate(submission.submissionDate)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-1 h-4 w-4" />
                        Contact Details
                      </div>
                      <p className="text-sm font-medium">{submission.applicantDetails.telephone}</p>
                      <p className="text-sm text-muted-foreground">
                        Sacco: {submission.applicantDetails.saccoAffiliation || "None"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <DollarSign className="mr-1 h-4 w-4" />
                        Financing Details
                      </div>
                      <p className="text-sm font-medium">
                        KSH {submission.applicantDetails.totalFinancingRequested} requested
                      </p>
                      <p className="text-sm text-muted-foreground">
                        KSH {submission.applicantDetails.availableDepositAmount} deposit available
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 break-all">
                        Wallet: {submission.applicantDetails.walletAddress}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Info className="mr-1 h-4 w-4" />
                        Additional Info
                      </div>
                      <p className="text-sm font-medium">
                        {submission.applicantDetails.numberOfMatatusOwned} matatus owned
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Has identified EV: {submission.applicantDetails.hasIdentifiedEV ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="destructive"
                      className="flex-1"
                      onClick={() => rejectSubmission(submission.applicantDetails.id)}
                    >
                      <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => approveSubmission(submission.applicantDetails.id)}
                    >
                      <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-4">
          {approvedSubmissions.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Approved Applications</CardTitle>
                <CardDescription>
                  You haven't approved any loan applications yet.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            approvedSubmissions.map((submission) => (
              <Card key={submission.applicantDetails.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        {submission.facialScanData ? (
                          <AvatarImage src={submission.facialScanData} alt={submission.applicantDetails.name} />
                        ) : (
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{submission.applicantDetails.name}</CardTitle>
                        <CardDescription>
                          {submission.applicantDetails.email} | ID: {submission.applicantDetails.idNumber}
                        </CardDescription>
                        <p className="text-xs text-muted-foreground mt-1">
                          Application ID: <span className="font-mono">{submission.applicantDetails.id}</span>
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1 text-green-500 border-green-500">
                      <CheckCircle className="h-3 w-3" /> Approved {submission.approvalDate ? formatDate(submission.approvalDate) : ""}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-1 h-4 w-4" />
                        Contact Details
                      </div>
                      <p className="text-sm font-medium">{submission.applicantDetails.telephone}</p>
                      <p className="text-sm text-muted-foreground">
                        Sacco: {submission.applicantDetails.saccoAffiliation || "None"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <DollarSign className="mr-1 h-4 w-4" />
                        Financing Details
                      </div>
                      <p className="text-sm font-medium">
                        KSH {submission.applicantDetails.totalFinancingRequested} approved
                      </p>
                      <p className="text-sm text-muted-foreground">
                        KSH {submission.applicantDetails.availableDepositAmount} deposit
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 break-all">
                        Wallet: {submission.applicantDetails.walletAddress}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Info className="mr-1 h-4 w-4" />
                        Transaction Info
                      </div>
                      <p className="text-sm font-medium truncate">
                        Hash: {submission.approvalHash || "N/A"}
                      </p>
                    </div>
                  </div>

                  {submission.applicantDetails.additionalNotes && (
                    <div className="col-span-1 md:col-span-3 mt-2">
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Info className="mr-1 h-4 w-4" />
                        Additional Notes
                      </div>
                      <p className="text-sm border rounded p-2 bg-gray-50 dark:bg-gray-900">
                        {submission.applicantDetails.additionalNotes}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Full Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-4">
          {rejectedSubmissions.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Rejected Applications</CardTitle>
                <CardDescription>
                  You haven't rejected any loan applications yet.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            rejectedSubmissions.map((submission) => (
              <Card key={submission.applicantDetails.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        {submission.facialScanData ? (
                          <AvatarImage src={submission.facialScanData} alt={submission.applicantDetails.name} />
                        ) : (
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{submission.applicantDetails.name}</CardTitle>
                        <CardDescription>
                          {submission.applicantDetails.email} | ID: {submission.applicantDetails.idNumber}
                        </CardDescription>
                        <p className="text-xs text-muted-foreground mt-1">
                          Application ID: <span className="font-mono">{submission.applicantDetails.id}</span>
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1 text-red-500 border-red-500">
                      <XCircle className="h-3 w-3" /> Rejected {submission.approvalDate ? formatDate(submission.approvalDate) : ""}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-1 h-4 w-4" />
                        Contact Details
                      </div>
                      <p className="text-sm font-medium">{submission.applicantDetails.telephone}</p>
                      <p className="text-sm text-muted-foreground">
                        {submission.applicantDetails.email}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <DollarSign className="mr-1 h-4 w-4" />
                        Financing Details
                      </div>
                      <p className="text-sm font-medium">
                        KSH {submission.applicantDetails.totalFinancingRequested} requested
                      </p>
                      <p className="text-sm text-muted-foreground">
                        KSH {submission.applicantDetails.availableDepositAmount} deposit
                      </p>
                    </div>
                  </div>

                  {submission.applicantDetails.additionalNotes && (
                    <div className="mt-2">
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Info className="mr-1 h-4 w-4" />
                        Additional Notes
                      </div>
                      <p className="text-sm border rounded p-2 bg-gray-50 dark:bg-gray-900">
                        {submission.applicantDetails.additionalNotes}
                      </p>
                    </div>
                  )}

                  {submission.feedback && (
                    <div className="mt-4 p-3 border rounded-md bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                      <p className="text-sm font-medium text-red-800 dark:text-red-400">Rejection Reason:</p>
                      <p className="text-sm text-red-700 dark:text-red-300">{submission.feedback}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Full Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 