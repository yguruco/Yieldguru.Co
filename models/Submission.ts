import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the VehicleDetails interface
interface IVehicleDetails {
  id: string;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  vin: string;
  mileage: string;
  color: string;
  fuelType: string;
  batteryCapacity: string;
  range: string;
  value: string;
  ownerName: string;
  ownerAddress: string;
  ownerContact: string;
  registrationDate: string;
  insuranceDetails: string;
  additionalNotes?: string;
}

// Define the Submission interface
export interface ISubmission extends Document {
  vehicleDetails: IVehicleDetails;
  facialScanData: string;
  vehicleImages: string[];
  operatorAddress: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvalDate?: string;
  approvalHash?: string;
  feedback?: string;
}

// Define the VehicleDetails schema
const VehicleDetailsSchema = new Schema<IVehicleDetails>({
  id: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: String, required: true },
  licensePlate: { type: String, required: true },
  vin: { type: String, required: true },
  mileage: { type: String, required: true },
  color: { type: String, required: true },
  fuelType: { type: String, required: true },
  batteryCapacity: { type: String, required: true },
  range: { type: String, required: true },
  value: { type: String, required: true },
  ownerName: { type: String, required: true },
  ownerAddress: { type: String, required: true },
  ownerContact: { type: String, required: true },
  registrationDate: { type: String, required: true },
  insuranceDetails: { type: String, required: true },
  additionalNotes: { type: String }
});

// Define the Submission schema
const SubmissionSchema = new Schema<ISubmission>({
  vehicleDetails: { type: VehicleDetailsSchema, required: true },
  facialScanData: { type: String, required: true },
  vehicleImages: { type: [String], required: true },
  operatorAddress: { type: String, required: true },
  submissionDate: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending',
    required: true 
  },
  approvalDate: { type: String },
  approvalHash: { type: String },
  feedback: { type: String }
}, {
  timestamps: true
});

// Create and export the model
let Submission: Model<ISubmission>;

try {
  // Try to get the existing model to prevent OverwriteModelError
  Submission = mongoose.model<ISubmission>('Submission');
} catch {
  // If the model doesn't exist, create it
  Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);
}

export default Submission;
