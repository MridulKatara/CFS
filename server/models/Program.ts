import { Schema, model } from "mongoose";

const ProgramSchema = new Schema({
  programId: {
    type: String,
    required: true,
    unique: true
  },
  programName: {
    type: String,
    required: true
  },
  detail: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Program = model("Program", ProgramSchema);
export default Program;
