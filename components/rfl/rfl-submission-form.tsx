"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Check,
  ChevronRight,
  FileText,
  Loader2,
  User,
  ChevronLeft,
  AlertTriangle,
  Copy,
  CheckCheck,
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
import { FacialScanStep } from "@/components/rfl/steps/facial-scan-step"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { RFLSubmission, LoanApplicant } from "@/types/rfl"

// Define the form schema
const loanApplicantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  telephone: z.string().min(10, "Valid phone number is required"),
  idNumber: z.string().min(1, "ID number is required"),
  email: z.string().email("Valid email is required"),
  saccoAffiliation: z.string().optional(),
  numberOfMatatusOwned: z.string().min(1, "Number of matatus owned is required"),
  availableDepositAmount: z.string().min(1, "Available deposit amount is required"),
  totalFinancingRequested: z.string().min(1, "Total financing requested is required"),
  hasIdentifiedEV: z.boolean().default(false),
  walletAddress: z.string().min(1, "Wallet address is required"),
  additionalNotes: z.string().optional(),
})

interface RFLSubmissionFormProps {
  onComplete: () => void
}

export function RFLSubmissionForm({ onComplete }: RFLSubmissionFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [facialScanData, setFacialScanData] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [incompleteSteps, setIncompleteSteps] = useState<number[]>([])
  const [draftSaved, setDraftSaved] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submissionId, setSubmissionId] = useState("")
  const [copied, setCopied] = useState(false)

  // Initialize form
  const form = useForm<z.infer<typeof loanApplicantSchema>>({
    resolver: zodResolver(loanApplicantSchema),
    defaultValues: {
      name: "",
      telephone: "",
      idNumber: "",
      email: "",
      saccoAffiliation: "",
      numberOfMatatusOwned: "",
      availableDepositAmount: "",
      totalFinancingRequested: "",
      hasIdentifiedEV: false,
      walletAddress: "",
      additionalNotes: "",
    },
  })

  // Load draft from localStorage if exists
  useEffect(() => {
    const savedDraft = localStorage.getItem("rflDraft")
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        if (draft.applicantDetails) {
          form.reset(draft.applicantDetails)
        }
        if (draft.facialScanData) {
          setFacialScanData(draft.facialScanData)
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
      applicantDetails: form.getValues(),
      facialScanData,
    }
    localStorage.setItem("rflDraft", JSON.stringify(draft))
    setDraftSaved(true)
  }

  const steps = [
    { title: "Applicant Details", icon: FileText, component: "applicantDetails" },
    { title: "Facial Scan", icon: User, component: "facialScan" },
    { title: "Review & Submit", icon: Check, component: "review" },
  ]

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Applicant Details
        return form.trigger().then((isValid) => isValid)
      case 1: // Facial Scan
        return !!facialScanData
      case 2: // Review
        return true
      default:
        return false
    }
  }

  const checkAllSteps = () => {
    const incomplete: number[] = []

    // Check applicant details
    const applicantDetailsValid = Object.keys(form.formState.errors).length === 0
    if (!applicantDetailsValid) incomplete.push(0)

    // Check facial scan
    if (!facialScanData) incomplete.push(1)

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

  const onSubmit = async (data: z.infer<typeof loanApplicantSchema>) => {
    // First check if all steps are complete
    const allComplete = checkAllSteps()
    if (!allComplete) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create a unique ID for the submission
      const uniqueId = uuidv4()
      setSubmissionId(uniqueId)

      // Create the applicant details object
      const applicantDetails: LoanApplicant = {
        id: uniqueId,
        ...data,
        facialScanData: facialScanData || "",
      }

      // Create the full submission object
      const submission: RFLSubmission = {
        applicantDetails,
        facialScanData: facialScanData || "",
        submissionDate: new Date().toISOString(),
        status: "pending",
      }

      // In a real application, you would send this to your API
      console.log("Submission data:", JSON.stringify(submission, null, 2))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store in local storage for demo purposes
      const existingSubmissions = JSON.parse(localStorage.getItem("rflSubmissions") || "[]")
      localStorage.setItem("rflSubmissions", JSON.stringify([...existingSubmissions, submission]))

      // Also store the submission individually by ID for easy retrieval
      localStorage.setItem(`rfl_${uniqueId}`, JSON.stringify(submission))

      // Clear the draft
      localStorage.removeItem("rflDraft")
      setDraftSaved(false)
      
      // Show success modal with ID
      setIsSubmitting(false)
      setShowSuccessModal(true)

      // Don't call onComplete yet - will do that after user dismisses modal
    } catch (error) {
      console.error("Error submitting form:", error)
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(submissionId).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      },
      (err) => {
        console.error("Could not copy text: ", err)
      }
    )
  }

  const closeSuccessModal = () => {
    setShowSuccessModal(false)
    onComplete()
  }

  const getStepStatus = (index: number) => {
    if (incompleteSteps.includes(index)) return "incomplete"
    if (index < currentStep) return "complete"
    if (index === currentStep) return "current"
    return "upcoming"
  }

  const calculateProgress = () => {
    const completedSteps = steps.length - incompleteSteps.length
    return (completedSteps / steps.length) * 100
  }

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="space-y-2">
        <Progress value={calculateProgress()} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(calculateProgress())}% complete</span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`flex items-center ${
              index < steps.length - 1 ? "flex-1" : ""
            }`}
            onClick={() => goToStep(index)}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                getStepStatus(index) === "complete"
                  ? "border-green-500 bg-green-500 text-white"
                  : getStepStatus(index) === "current"
                  ? "border-[#f68b27] text-[#f68b27]"
                  : getStepStatus(index) === "incomplete"
                  ? "border-red-500 text-red-500"
                  : "border-gray-300 text-gray-300"
              } cursor-pointer text-sm font-medium`}
            >
              {getStepStatus(index) === "complete" ? (
                <Check className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </motion.div>
            <div
              className={`ml-2 text-sm font-medium ${
                getStepStatus(index) === "current"
                  ? "text-[#f68b27]"
                  : getStepStatus(index) === "complete"
                  ? "text-green-500"
                  : getStepStatus(index) === "incomplete"
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {step.title}
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 border-t border-gray-300 ml-2 mr-2 mt-5"></div>
            )}
          </div>
        ))}
      </div>

      {/* Draft saved indicator */}
      {draftSaved && (
        <div className="flex items-center justify-end text-xs text-muted-foreground">
          <span>Draft saved</span>
        </div>
      )}

      {/* Form steps */}
      <div className="mt-8">
        {currentStep === 0 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(nextStep)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telephone</FormLabel>
                      <FormControl>
                        <Input placeholder="+254 XXX XXX XXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="National ID Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="saccoAffiliation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sacco Affiliated to (if any)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Sacco name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberOfMatatusOwned"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Matatus owned</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="availableDepositAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available deposit amount (KSH)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 500,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="totalFinancingRequested"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total financing requested (KSH)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2,500,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hasIdentifiedEV"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Have you identified an EV to acquire?</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value === "true")} 
                        defaultValue={field.value ? "true" : "false"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Address</FormLabel>
                      <FormControl>
                        <Input placeholder="0x..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter any additional information about your loan application..." 
                          className="min-h-[100px] resize-y"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-[#f68b27] hover:bg-[#f68b27]/90"
                >
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        )}
        
        {currentStep === 1 && (
          <div className="space-y-6">
            <FacialScanStep 
              onScanComplete={(data) => setFacialScanData(data)} 
              existingScanData={facialScanData}
            />
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Step
              </Button>
              <Button 
                onClick={nextStep}
                disabled={!facialScanData}
                className="bg-[#f68b27] hover:bg-[#f68b27]/90"
              >
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium">Review Your Application</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please review your loan application details before submitting.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Personal Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Name:</div>
                  <div>{form.getValues().name}</div>
                  
                  <div className="text-muted-foreground">Telephone:</div>
                  <div>{form.getValues().telephone}</div>
                  
                  <div className="text-muted-foreground">ID Number:</div>
                  <div>{form.getValues().idNumber}</div>
                  
                  <div className="text-muted-foreground">Email:</div>
                  <div>{form.getValues().email}</div>
                  
                  <div className="text-muted-foreground">Sacco Affiliation:</div>
                  <div>{form.getValues().saccoAffiliation || "None"}</div>
                  
                  <div className="text-muted-foreground">Wallet Address:</div>
                  <div className="break-all">{form.getValues().walletAddress}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Loan Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Number of Matatus owned:</div>
                  <div>{form.getValues().numberOfMatatusOwned}</div>
                  
                  <div className="text-muted-foreground">Available deposit:</div>
                  <div>KSH {form.getValues().availableDepositAmount}</div>
                  
                  <div className="text-muted-foreground">Financing requested:</div>
                  <div>KSH {form.getValues().totalFinancingRequested}</div>
                  
                  <div className="text-muted-foreground">Identified EV:</div>
                  <div>{form.getValues().hasIdentifiedEV ? "Yes" : "No"}</div>
                </div>
              </div>
            </div>
            
            {form.getValues().additionalNotes && (
              <div className="space-y-4">
                <h4 className="font-medium">Additional Notes</h4>
                <div className="text-sm border rounded-md p-3 bg-gray-50 dark:bg-gray-900">
                  {form.getValues().additionalNotes}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-medium">Facial Scan</h4>
              {facialScanData ? (
                <div className="w-48 h-48 rounded-lg overflow-hidden">
                  <img 
                    src={facialScanData} 
                    alt="Facial scan" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Facial scan is missing. Please go back and complete this step.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {incompleteSteps.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Incomplete Application</AlertTitle>
                <AlertDescription>
                  Please complete all required steps before submitting:
                  <ul className="list-disc list-inside mt-2">
                    {incompleteSteps.includes(0) && (
                      <li>Fill in all required applicant details</li>
                    )}
                    {incompleteSteps.includes(1) && (
                      <li>Complete your facial scan</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Step
              </Button>
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting || incompleteSteps.length > 0}
                className="bg-[#f68b27] hover:bg-[#f68b27]/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCheck className="h-6 w-6 text-green-500" />
              Application Submitted Successfully
            </DialogTitle>
            <DialogDescription>
              Your loan application has been submitted and is pending review.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <p className="mb-4 text-sm text-muted-foreground">
              Please save your unique application ID. You'll need this ID to track your application 
              or when proceeding with the loan creation process:
            </p>
            
            <div className="flex items-center space-x-2">
              <div className="flex-1 rounded-md border px-3 py-2 bg-gray-50 dark:bg-gray-900 font-mono">
                {submissionId}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={copyToClipboard}
                className={copied ? "text-green-500 border-green-500" : ""}
              >
                {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button 
              onClick={closeSuccessModal} 
              className="w-full bg-[#f68b27] hover:bg-[#f68b27]/90"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 