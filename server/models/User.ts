import mongoose, { Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  fullName: string;
  personalEmail: string;
  universityName: string;
  program?: string;
  currentSemester?: number;
  branch?: string;
  paymentStatus?: 'Pending' | 'Completed';
  role: 'super-admin' | 'admin' | 'student';
  password: string;
  mobileNumber: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  fcmToken?: string;
}

export interface IUserDocument extends Document<Types.ObjectId>, IUser {
  _id: Types.ObjectId;
}

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  personalEmail: { type: String, required: true, unique: true },
  universityName: { type: String, required: true },
  program: { type: String, required: false },
  currentSemester: { type: Number, required: false, default: 1 },
  branch: { type: String, required: false },
  paymentStatus: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  role: { type: String, enum: ['super-admin', 'admin', 'student'], default: 'student' },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  fcmToken: {
    type: String,
    default: null
  },
}, {
  timestamps: true 
});

// Update the pre-save hook to use bcryptjs
userSchema.pre('save', async function(this: IUserDocument) {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Update the compare method to use bcryptjs
userSchema.methods.comparePassword = async function(this: IUserDocument, candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUserDocument>('User', userSchema);
export default User;
