"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RFTSubmissionForm } from "@/components/rft/rft-submission-form"
import { RFTSubmissionStatus } from "@/components/rft/rft-submission-status"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function RFTPage() {
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Request for Tokenization (RFT)</h1>
          <p className="text-muted-foreground">Submit your vehicle details for tokenization approval</p>
        </div>
        {!isCreatingNew && (
          <Button onClick={() => setIsCreatingNew(true)} className="bg-[#f68b27] hover:bg-[#f68b27]/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            New RFT Submission
          </Button>
        )}
      </div>

      {isCreatingNew ? (
        <Card>
          <CardHeader>
            <CardTitle>New RFT Submission</CardTitle>
            <CardDescription>Complete all required steps to submit your vehicle for tokenization</CardDescription>
          </CardHeader>
          <CardContent>
            <RFTSubmissionForm onComplete={() => setIsCreatingNew(false)} />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Submissions</TabsTrigger>
            <TabsTrigger value="approved">Approved Assets</TabsTrigger>
            <TabsTrigger value="rejected">Rejected Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <RFTSubmissionStatus status="pending" />
          </TabsContent>

          <TabsContent value="approved">
            <RFTSubmissionStatus status="approved" />
          </TabsContent>

          <TabsContent value="rejected">
            <RFTSubmissionStatus status="rejected" />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
