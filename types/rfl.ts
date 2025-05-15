export interface LoanApplicant {
  id: string
  name: string
  telephone: string
  idNumber: string
  email: string
  saccoAffiliation: string
  numberOfMatatusOwned: string
  availableDepositAmount: string
  totalFinancingRequested: string
  hasIdentifiedEV: boolean
  walletAddress: string
  additionalNotes?: string
  facialScanData: string
}

export interface RFLSubmission {
  applicantDetails: LoanApplicant
  facialScanData: string
  submissionDate: string
  status: "pending" | "approved" | "rejected"
  approvalDate?: string
  approvalHash?: string
  feedback?: string
}

export interface LoanApplication {
  id: string
  applicantName: string
  applicantFacialScan: string
  email: string
  telephone: string
  financingAmount: string
  status: "pending" | "approved" | "rejected"
  submissionDate: string
  approvalDate?: string
  feedback?: string
} 