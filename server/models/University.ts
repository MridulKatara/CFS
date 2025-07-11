import mongoose, { Schema, Document } from 'mongoose';

export interface IUniversity extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const UniversitySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, 
{ 
  timestamps: true 
});

export default mongoose.model<IUniversity>('University', UniversitySchema); 