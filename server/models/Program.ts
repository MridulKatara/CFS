import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
    name: String,
    designation: String,
    specialization: String
});

const enrollmentDetailsSchema = new mongoose.Schema({
    fee: Number,
    startDate: Date,
    endDate: Date
});

const semesterSchema = new mongoose.Schema({
    fee: Number,
    semester: Number,
    startDate: Date,
    endDate: Date
});

const programSchema = new mongoose.Schema({
    programId: String,
    programName: String,
    collegeName: String,
    detail: String,
    semesterCount: Number,
    fee: String,
    faculty: [facultySchema],
    eligibility: String,
    semesters: [semesterSchema],
    enrollmentDetails: enrollmentDetailsSchema
}, { timestamps: true });

export const Program = mongoose.model('Program', programSchema);
