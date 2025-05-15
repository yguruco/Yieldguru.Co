"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RFLSubmissionForm } from "@/components/rfl/rfl-submission-form"
import { RFLSubmissionStatus } from "@/components/rfl/rfl-submission-status"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function RFLPage() {
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Request for Loan (RFL)</h1>
          <p className="text-muted-foreground">Apply for financing to acquire an electric vehicle</p>
        </div>
        {!isCreatingNew && (
          <Button onClick={() => setIsCreatingNew(true)} className="bg-[#f68b27] hover:bg-[#f68b27]/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Loan Application
          </Button>
        )}
      </div>

      {isCreatingNew ? (
        <Card>
          <CardHeader>
            <CardTitle>New Loan Application</CardTitle>
            <CardDescription>Complete all required steps to apply for EV financing</CardDescription>
          </CardHeader>
          <CardContent>
            <RFLSubmissionForm onComplete={() => setIsCreatingNew(false)} />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Applications</TabsTrigger>
            <TabsTrigger value="approved">Approved Loans</TabsTrigger>
            <TabsTrigger value="rejected">Rejected Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <RFLSubmissionStatus status="pending" />
          </TabsContent>

          <TabsContent value="approved">
            <RFLSubmissionStatus status="approved" />
          </TabsContent>

          <TabsContent value="rejected">
            <RFLSubmissionStatus status="rejected" />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
} 