import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
  status: 'New' | 'Read' | 'Responded';
}

const contactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Read', 'Responded'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

// Delete the mongoose model if it exists to prevent overwrite error in development
const ContactSubmission = (mongoose.models.ContactSubmission as Model<IContactSubmission>) || 
  mongoose.model<IContactSubmission>('ContactSubmission', contactSubmissionSchema);

export default ContactSubmission;
