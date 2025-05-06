"use client"

import { Check, AlertTriangle, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { VehicleDetails } from "@/types/rft"

interface SubmissionReviewStepProps {
  vehicleDetails: Partial<VehicleDetails>
  facialScanComplete: boolean
  imagesUploaded: boolean
  addressProvided: boolean
  incompleteSteps: number[]
  onEditStep: (step: number) => void
}

export function SubmissionReviewStep({
  vehicleDetails,
  facialScanComplete,
  imagesUploaded,
  addressProvided,
  incompleteSteps,
  onEditStep,
}: SubmissionReviewStepProps) {
  const allStepsComplete = facialScanComplete && imagesUploaded && addressProvided && incompleteSteps.length === 0

  // Format address for display
  const formatAddress = () => {
    if (!addressProvided) return "Not provided"

    try {
      // Try to parse the address if it's a JSON string
      const addressObj =
        typeof vehicleDetails.ownerAddress === "string"
          ? JSON.parse(vehicleDetails.ownerAddress)
          : vehicleDetails.ownerAddress

      if (addressObj) {
        return (
          <div className="space-y-1">
            <p>{addressObj.streetAddress}</p>
            <p>
              {addressObj.city}, {addressObj.state} {addressObj.zipCode}
            </p>
            <p>{addressObj.country}</p>
            <p className="mt-2 text-xs font-medium text-gray-500">Wallet Address:</p>
            <p className="text-xs font-mono break-all">{addressObj.walletAddress}</p>
          </div>
        )
      }
    } catch (e) {
      // If parsing fails, just return the raw string
      return vehicleDetails.ownerAddress
    }

    return "Address format error"
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Review Your Submission</h2>
        <p className="text-gray-500">Please review all the information before submitting your tokenization request.</p>
      </div>

      {!allStepsComplete && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Incomplete Submission</AlertTitle>
          <AlertDescription>
            Please complete all required steps before submitting your request. Click the "Edit" button on incomplete
            sections to complete them.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className={incompleteSteps.includes(0) ? "border-red-500" : ""}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Vehicle Information</CardTitle>
              <CardDescription>Details about your electric vehicle</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEditStep(0)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit vehicle information</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Make:</div>
              <div>{vehicleDetails.make || "Not provided"}</div>

              <div className="font-medium">Model:</div>
              <div>{vehicleDetails.model || "Not provided"}</div>

              <div className="font-medium">Year:</div>
              <div>{vehicleDetails.year || "Not provided"}</div>

              <div className="font-medium">License Plate:</div>
              <div>{vehicleDetails.licensePlate || "Not provided"}</div>

              <div className="font-medium">VIN:</div>
              <div>{vehicleDetails.vin || "Not provided"}</div>

              <div className="font-medium">Color:</div>
              <div>{vehicleDetails.color || "Not provided"}</div>

              <div className="font-medium">Fuel Type:</div>
              <div>{vehicleDetails.fuelType || "Not provided"}</div>

              <div className="font-medium">Battery Capacity:</div>
              <div>{vehicleDetails.batteryCapacity ? `${vehicleDetails.batteryCapacity} kWh` : "Not provided"}</div>

              <div className="font-medium">Range:</div>
              <div>{vehicleDetails.range ? `${vehicleDetails.range} miles` : "Not provided"}</div>

              <div className="font-medium">Value:</div>
              <div>{vehicleDetails.value ? `$${vehicleDetails.value}` : "Not provided"}</div>
            </div>
          </CardContent>
        </Card>

        <Card className={incompleteSteps.includes(0) ? "border-red-500" : ""}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Owner Information</CardTitle>
              <CardDescription>Your contact and registration details</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEditStep(0)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit owner information</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Owner Name:</div>
              <div>{vehicleDetails.ownerName || "Not provided"}</div>

              <div className="font-medium">Contact:</div>
              <div>{vehicleDetails.ownerContact || "Not provided"}</div>

              <div className="font-medium">Registration Date:</div>
              <div>{vehicleDetails.registrationDate || "Not provided"}</div>

              <div className="font-medium">Insurance Details:</div>
              <div>{vehicleDetails.insuranceDetails || "Not provided"}</div>

              {vehicleDetails.additionalNotes && (
                <>
                  <div className="font-medium">Additional Notes:</div>
                  <div>{vehicleDetails.additionalNotes}</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className={!facialScanComplete || incompleteSteps.includes(1) ? "border-red-500" : "border-green-500"}>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-base">Facial Scan</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEditStep(1)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit facial scan</span>
            </Button>
          </CardHeader>
          <CardContent className="p-4 flex items-center">
            <div className={`rounded-full p-1 mr-3 ${facialScanComplete ? "bg-green-500" : "bg-red-500"}`}>
              {facialScanComplete ? (
                <Check className="h-4 w-4 text-white" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-white" />
              )}
            </div>
            <div>
              <p className="text-sm">{facialScanComplete ? "Completed" : "Not completed"}</p>
              {!facialScanComplete && <p className="text-xs text-red-500 mt-1">Required for identity verification</p>}
            </div>
          </CardContent>
        </Card>

        <Card className={!imagesUploaded || incompleteSteps.includes(2) ? "border-red-500" : "border-green-500"}>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-base">Vehicle Images</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEditStep(2)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit vehicle images</span>
            </Button>
          </CardHeader>
          <CardContent className="p-4 flex items-center">
            <div className={`rounded-full p-1 mr-3 ${imagesUploaded ? "bg-green-500" : "bg-red-500"}`}>
              {imagesUploaded ? (
                <Check className="h-4 w-4 text-white" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-white" />
              )}
            </div>
            <div>
              <p className="text-sm">{imagesUploaded ? "Uploaded" : "Not uploaded"}</p>
              {!imagesUploaded && <p className="text-xs text-red-500 mt-1">At least one vehicle image is required</p>}
            </div>
          </CardContent>
        </Card>

        <Card className={!addressProvided || incompleteSteps.includes(3) ? "border-red-500" : "border-green-500"}>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-base">Address Information</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEditStep(3)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit address information</span>
            </Button>
          </CardHeader>
          <CardContent className="p-4 flex items-center">
            <div className={`rounded-full p-1 mr-3 ${addressProvided ? "bg-green-500" : "bg-red-500"}`}>
              {addressProvided ? (
                <Check className="h-4 w-4 text-white" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-white" />
              )}
            </div>
            <div>
              <p className="text-sm">{addressProvided ? "Provided" : "Not provided"}</p>
              {!addressProvided && <p className="text-xs text-red-500 mt-1">Address and wallet information required</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {addressProvided && (
        <Card>
          <CardHeader>
            <CardTitle>Address Details</CardTitle>
            <CardDescription>Your physical and wallet address information</CardDescription>
          </CardHeader>
          <CardContent>{formatAddress()}</CardContent>
        </Card>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          By submitting this request, you confirm that all information provided is accurate and complete. Your request
          will be reviewed by our admin team, and you will receive a notification once it has been processed.
        </p>
      </div>
    </div>
  )
}
