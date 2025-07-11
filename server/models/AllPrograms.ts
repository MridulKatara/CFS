import { Schema, model } from "mongoose";

const ToolSchema = new Schema({
  name: { type: String, required: true },
  logoUrl: { type: String, required: true }
});

const FactSchema = new Schema({
  content: { type: String, required: true },
  imageUrl: { type: String },
  highlight: { type: String }
});

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
  toolkit: [ToolSchema],
  facts: [FactSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AllProgram = model("AllProgram", AllProgramSchema, "allprograms");
export default AllProgram;
