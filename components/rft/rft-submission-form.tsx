"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Check,
  ChevronRight,
  FileText,
  ImageIcon,
  Loader2,
  MapPin,
  User,
  ChevronLeft,
  AlertTriangle,
} from "lucide-react"
import { motion } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FacialScanStep } from "@/components/rft/steps/facial-scan-step"
import { ImageUploadStep } from "@/components/rft/steps/image-upload-step"
import { AddressStep } from "@/components/rft/steps/address-step"
import { SubmissionReviewStep } from "@/components/rft/steps/submission-review-step"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import type { RFTSubmission, VehicleDetails } from "@/types/rft"

// Define the form schema
const vehicleDetailsSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(4, "Valid year is required"),
  licensePlate: z.string().min(1, "License plate is required"),
  vin: z.string().min(17, "VIN must be 17 characters").max(17),
  mileage: z.string().min(1, "Mileage is required"),
  color: z.string().min(1, "Color is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  batteryCapacity: z.string().min(1, "Battery capacity is required"),
  range: z.string().min(1, "Range is required"),
  value: z.string().min(1, "Value is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  ownerContact: z.string().min(1, "Contact information is required"),
  registrationDate: z.string().min(1, "Registration date is required"),
  insuranceDetails: z.string().min(1, "Insurance details are required"),
  additionalNotes: z.string().optional(),
})

interface RFTSubmissionFormProps {
  onComplete: () => void
}

export function RFTSubmissionForm({ onComplete }: RFTSubmissionFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [facialScanData, setFacialScanData] = useState<string | null>(null)
  const [vehicleImages, setVehicleImages] = useState<string[]>([])
  const [operatorAddress, setOperatorAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [incompleteSteps, setIncompleteSteps] = useState<number[]>([])
  const [draftSaved, setDraftSaved] = useState(false)

  // Initialize form
  const form = useForm<z.infer<typeof vehicleDetailsSchema>>({
    resolver: zodResolver(vehicleDetailsSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      licensePlate: "",
      vin: "",
      mileage: "",
      color: "",
      fuelType: "Electric",
      batteryCapacity: "",
      range: "",
      value: "",
      ownerName: "",
      ownerContact: "",
      registrationDate: "",
      insuranceDetails: "",
      additionalNotes: "",
    },
  })

  // Load draft from localStorage if exists
  useEffect(() => {
    const savedDraft = localStorage.getItem("rftDraft")
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        if (draft.vehicleDetails) {
          form.reset(draft.vehicleDetails)
        }
        if (draft.facialScanData) {
          setFacialScanData(draft.facialScanData)
        }
        if (draft.vehicleImages) {
          setVehicleImages(draft.vehicleImages)
        }
        if (draft.operatorAddress) {
          setOperatorAddress(draft.operatorAddress)
        }
        setDraftSaved(true)
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }
  }, [form])

  // Save draft to localStorage
  const saveDraft = () => {
    const draft = {
      vehicleDetails: form.getValues(),
      facialScanData,
      vehicleImages,
      operatorAddress,
    }
    localStorage.setItem("rftDraft", JSON.stringify(draft))
    setDraftSaved(true)
  }

  const steps = [
    { title: "Vehicle Details", icon: FileText, component: "vehicleDetails" },
    { title: "Facial Scan", icon: User, component: "facialScan" },
    { title: "Upload Images", icon: ImageIcon, component: "uploadImages" },
    { title: "Address", icon: MapPin, component: "address" },
    { title: "Review & Submit", icon: Check, component: "review" },
  ]

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Vehicle Details
        return form.trigger().then((isValid) => isValid)
      case 1: // Facial Scan
        return !!facialScanData
      case 2: // Upload Images
        return vehicleImages.length > 0
      case 3: // Address
        return !!operatorAddress
      case 4: // Review
        return true
      default:
        return false
    }
  }

  const checkAllSteps = () => {
    const incomplete: number[] = []

    // Check vehicle details
    const vehicleDetailsValid = Object.keys(form.formState.errors).length === 0
    if (!vehicleDetailsValid) incomplete.push(0)

    // Check facial scan
    if (!facialScanData) incomplete.push(1)

    // Check images
    if (vehicleImages.length === 0) incomplete.push(2)

    // Check address
    if (!operatorAddress) incomplete.push(3)

    setIncompleteSteps(incomplete)
    return incomplete.length === 0
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()

    if (isValid) {
      saveDraft()
      setCurrentStep(currentStep + 1)
    } else {
      // Show error for the current step
      if (currentStep === 1 && !facialScanData) {
        alert("Please complete the facial scan before proceeding")
      } else if (currentStep === 2 && vehicleImages.length === 0) {
        alert("Please upload at least one vehicle image before proceeding")
      } else if (currentStep === 3 && !operatorAddress) {
        alert("Please provide your address information before proceeding")
      }
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const goToStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step)
    } else if (step === currentStep + 1) {
      nextStep()
    }
  }

  const onSubmit = async (data: z.infer<typeof vehicleDetailsSchema>) => {
    // First check if all steps are complete
    const allComplete = checkAllSteps()
    if (!allComplete) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create a unique ID for the submission
      const submissionId = uuidv4()

      // Create the vehicle details object
      const vehicleDetails: VehicleDetails = {
        id: submissionId,
        ...data,
        ownerAddress: operatorAddress,
      }

      // Create the full submission object
      const submission: RFTSubmission = {
        vehicleDetails,
        facialScanData: facialScanData || "",
        vehicleImages,
        operatorAddress,
        submissionDate: new Date().toISOString(),
        status: "pending",
      }

      // In a real application, you would send this to your API
      console.log("Submission data:", JSON.stringify(submission, null, 2))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store in local storage for demo purposes
      const existingSubmissions = JSON.parse(localStorage.getItem("rftSubmissions") || "[]")
      localStorage.setItem("rftSubmissions", JSON.stringify([...existingSubmissions, submission]))

      // Clear the draft
      localStorage.removeItem("rftDraft")
      setDraftSaved(false)

      // Reset form and redirect
      setIsSubmitting(false)
      onComplete()

      // Show success message
      alert("Your RFT submission has been received and is pending approval.")
    } catch (error) {
      console.error("Error submitting RFT:", error)
      setIsSubmitting(false)
      alert("There was an error submitting your request. Please try again.")
    }
  }

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed"
    if (index === currentStep) return "current"
    return "upcoming"
  }

  const calculateProgress = () => {
    return ((currentStep + 1) / steps.length) * 100
  }

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="w-full">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span>{steps[currentStep].title}</span>
        </div>
        <Progress value={calculateProgress()} className="h-2" />
      </div>

      {/* Stepper */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => goToStep(index)}
              disabled={index > currentStep + 1}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                currentStep === index
                  ? "border-[#f68b27] bg-[#f68b27] text-white"
                  : currentStep > index
                    ? "border-green-500 bg-green-500 text-white cursor-pointer"
                    : index === currentStep + 1
                      ? "border-gray-300 bg-white text-gray-400 cursor-pointer hover:border-[#f68b27]/50"
                      : "border-gray-300 bg-white text-gray-400 cursor-not-allowed"
              } ${incompleteSteps.includes(index) ? "border-red-500" : ""}`}
            >
              {currentStep > index ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
            </button>
            <span
              className={`mt-2 text-xs ${
                currentStep === index
                  ? "font-medium text-[#f68b27]"
                  : incompleteSteps.includes(index)
                    ? "font-medium text-red-500"
                    : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {draftSaved && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTitle className="text-blue-800">Draft saved</AlertTitle>
          <AlertDescription className="text-blue-700">
            Your progress has been saved. You can continue later from where you left off.
          </AlertDescription>
        </Alert>
      )}

      {/* Form Steps */}
      <div className="mt-8">
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Form {...form}>
              <form className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Make</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Tesla" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Model</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Model 3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="licensePlate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Plate</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., ABC123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VIN (Vehicle Identification Number)</FormLabel>
                        <FormControl>
                          <Input placeholder="17-character VIN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mileage</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 15000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., White" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Electric">Electric</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                            <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="batteryCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Battery Capacity (kWh)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 75" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="range"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Range (miles)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 300" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Value ($)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 45000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Owner Information</h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="ownerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Owner Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ownerContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Information</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone or email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="registrationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="insuranceDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Details</FormLabel>
                          <FormControl>
                            <Input placeholder="Insurance provider and policy number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional information about the vehicle"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <FacialScanStep
              onScanComplete={(scanData) => setFacialScanData(scanData)}
              existingScanData={facialScanData}
            />
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ImageUploadStep onImagesUploaded={(images) => setVehicleImages(images)} existingImages={vehicleImages} />
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AddressStep
              onAddressSubmitted={(address) => setOperatorAddress(address)}
              existingAddress={operatorAddress}
            />
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SubmissionReviewStep
              vehicleDetails={form.getValues()}
              facialScanComplete={!!facialScanData}
              imagesUploaded={vehicleImages.length > 0}
              addressProvided={!!operatorAddress}
              incompleteSteps={incompleteSteps}
              onEditStep={(step) => setCurrentStep(step)}
            />
          </motion.div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button onClick={nextStep} className="bg-[#f68b27] hover:bg-[#f68b27]/90">
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => onSubmit(form.getValues())}
            className="bg-[#f68b27] hover:bg-[#f68b27]/90"
            disabled={isSubmitting || incompleteSteps.length > 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>Submit RFT</>
            )}
          </Button>
        )}
      </div>

      {incompleteSteps.length > 0 && currentStep === 4 && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Incomplete submission</AlertTitle>
          <AlertDescription>
            Please complete all required steps before submitting. Click on the step indicators above to navigate to
            incomplete sections.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
