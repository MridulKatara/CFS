import { Schema, model } from "mongoose";

const AllProgramSchema = new Schema({
  programId: { type: String, required: true, unique: true },
  programName: { type: String, required: true },
  collegeName: String,
  detail: String,
  semesterCount: Number,
  fee: String,
  faculty: Array,
  eligibility: String,
  semesters: Array,
  enrollmentDetails: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AllProgram = model("AllProgram", AllProgramSchema, "allprograms");
export default AllProgram;
