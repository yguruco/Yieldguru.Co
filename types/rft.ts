export interface VehicleDetails {
  id: string
  make: string
  model: string
  year: string
  licensePlate: string
  vin: string
  mileage: string
  color: string
  fuelType: string
  batteryCapacity: string
  range: string
  value: string
  ownerName: string
  ownerAddress: string
  ownerContact: string
  registrationDate: string
  insuranceDetails: string
  additionalNotes?: string
}

export interface RFTSubmission {
  vehicleDetails: VehicleDetails
  facialScanData: string
  vehicleImages: string[]
  operatorAddress: string
  submissionDate: string
  status: "pending" | "approved" | "rejected"
  approvalDate?: string
  approvalHash?: string
  feedback?: string
}

export interface AssetCard {
  id: string
  vehicleName: string
  vehicleImage: string
  operatorName: string
  vehicleValue: string
  status: "pending" | "approved" | "rejected"
  approvalHash?: string
  submissionDate: string
  approvalDate?: string
  feedback?: string
}
