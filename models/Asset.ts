import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the Asset interface
export interface IAsset extends Document {
  id: string;
  name: string;
  image: string;
  type: string;
  operator: string;
  value: number;
  tokenization: number;
  status: string;
  tokenizationHash?: string;
  tokenizationDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Asset schema
const AssetSchema = new Schema<IAsset>({
  id: { 
    type: String, 
    required: [true, 'Asset ID is required'],
    unique: true,
    trim: true
  },
  name: { 
    type: String, 
    required: [true, 'Asset name is required'],
    trim: true
  },
  image: { 
    type: String, 
    required: [true, 'Asset image is required']
  },
  type: { 
    type: String, 
    required: [true, 'Asset type is required'],
    trim: true
  },
  operator: { 
    type: String, 
    required: [true, 'Operator name is required'],
    trim: true
  },
  value: { 
    type: Number, 
    required: [true, 'Asset value is required'],
    min: [0, 'Asset value cannot be negative']
  },
  tokenization: { 
    type: Number, 
    required: [true, 'Tokenization percentage is required'],
    min: [0, 'Tokenization percentage cannot be negative'],
    max: [100, 'Tokenization percentage cannot exceed 100']
  },
  status: { 
    type: String, 
    required: [true, 'Asset status is required'],
    enum: ['Active', 'Pending', 'Onboarding', 'Inactive'],
    default: 'Active'
  },
  tokenizationHash: { 
    type: String
  },
  tokenizationDate: { 
    type: String
  }
}, {
  timestamps: true
});

// Create and export the model
let Asset: Model<IAsset>;

try {
  // Try to get the existing model to prevent OverwriteModelError
  Asset = mongoose.model<IAsset>('Asset');
} catch {
  // If the model doesn't exist, create it
  Asset = mongoose.model<IAsset>('Asset', AssetSchema);
}

export default Asset;
