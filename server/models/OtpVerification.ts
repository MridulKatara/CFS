import mongoose, { Document, Schema } from 'mongoose';

export interface IOtpVerification extends Document {
  email: string; // was userId
  mobileNumber: string;
  otpMobile: string; // hashed
  otpEmail: string;  // hashed
  createdAt: Date;
  mobileAttempts: number;
  emailAttempts: number;
  verified: boolean;
  userData: any; // Add this to store user data
}

const OtpVerificationSchema = new Schema<IOtpVerification>({
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  otpMobile: { type: String, required: true },
  otpEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // 10 min expiry
  mobileAttempts: { type: Number, default: 0 },
  emailAttempts: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  userData: { type: Schema.Types.Mixed } // Add this field
});

export default mongoose.model<IOtpVerification>('OtpVerification', OtpVerificationSchema);
