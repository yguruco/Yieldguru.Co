"use client"

import { useState } from "react"
import { Search, ArrowRight, AlertCircle, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { RFLSubmission } from "@/types/rfl"

interface ApplicationLookupProps {
  onApplicationFound: (application: RFLSubmission) => void
}

export function ApplicationLookup({ onApplicationFound }: ApplicationLookupProps) {
  const [applicationId, setApplicationId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [foundApplication, setFoundApplication] = useState<RFLSubmission | null>(null)

  const lookupApplication = () => {
    if (!applicationId.trim()) {
      setError("Please enter an application ID")
      return
    }

    setError(null)
    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Try to find the application in localStorage
        const application = localStorage.getItem(`rfl_${applicationId}`)
        
        if (!application) {
          setError("No application found with this ID. Please check and try again.")
          setFoundApplication(null)
          setIsLoading(false)
          return
        }
        
        const parsedApplication = JSON.parse(application) as RFLSubmission
        setFoundApplication(parsedApplication)
        setIsLoading(false)
      } catch (err) {
        console.error("Error looking up application:", err)
        setError("An error occurred while looking up the application")
        setFoundApplication(null)
        setIsLoading(false)
      }
    }, 800)
  }

  const handleUseApplication = () => {
    if (foundApplication) {
      onApplicationFound(foundApplication)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter RFL application ID"
            className="pl-8"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && lookupApplication()}
          />
        </div>
        <Button 
          onClick={lookupApplication} 
          disabled={isLoading}
          className="bg-[#f68b27] hover:bg-[#f68b27]/90"
        >
          {isLoading ? "Searching..." : "Find Application"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {foundApplication && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <Avatar className="h-16 w-16">
                {foundApplication.facialScanData ? (
                  <AvatarImage 
                    src={foundApplication.facialScanData} 
                    alt={foundApplication.applicantDetails.name} 
                  />
                ) : (
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-medium">{foundApplication.applicantDetails.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Applied on {formatDate(foundApplication.submissionDate)}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      foundApplication.status === "approved" ? "outline" : 
                      foundApplication.status === "rejected" ? "destructive" : "secondary"
                    }
                  >
                    {foundApplication.status.charAt(0).toUpperCase() + foundApplication.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="font-medium">Application ID:</span>{" "}
                    <span className="font-mono">{foundApplication.applicantDetails.id.substring(0, 8)}...</span>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {foundApplication.applicantDetails.telephone}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {foundApplication.applicantDetails.email}
                  </div>
                  <div>
                    <span className="font-medium">Amount Requested:</span>{" "}
                    KSH {foundApplication.applicantDetails.totalFinancingRequested}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Wallet Address:</span>{" "}
                    <span className="break-all">{foundApplication.applicantDetails.walletAddress}</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handleUseApplication} 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Use This Application Data
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 