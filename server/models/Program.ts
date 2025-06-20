import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    specialization: { type: String, required: true },
});

const enrollmentDetailsSchema = new mongoose.Schema({
    fee: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});

const semesterSchema = new mongoose.Schema({
    fee: { type: Number, required: true },
    semester: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});

const programSchema = new mongoose.Schema({
    programId: { type: String, required: true, unique: true },
    programName: { type: String, required: true },
    collegeName: { type: String, required: true },
    detail: { type: String, required: true },
    semesterCount: { type: Number, required: true },
    fee: { type: String, required: true },
    faculty: {
        type: [facultySchema],
        required: true,
    },
    eligibility: { type: String, required: true },
    semesters: {
        type: [semesterSchema],
        required: true,
        validate: {
            validator: function (v: any[]): boolean {
                // @ts-ignore
                return v.length === this.semesterCount;
            },
            message: 'Number of semesters must match semesterCount',
            context: 'semesterCount'
        }
    },
    enrollmentDetails: {
        type: enrollmentDetailsSchema,
        required: true,
    }
}, {
    timestamps: true,
});

const Program = mongoose.model('AllPrograms', programSchema);
export default Program;
