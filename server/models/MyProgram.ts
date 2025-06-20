import mongoose from 'mongoose';

const semesterPaymentSchema = new mongoose.Schema({
    semesterName: { type: String, required: true },
    paid: { type: Boolean, default: false },
    paymentId: { type: String }, // Razorpay payment id
    paidAt: { type: Date },
});

const myProgramSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    programId: { type: String, required: true },
    enrollmentFeePaid: { type: Boolean, default: false },
    enrollmentPaymentId: { type: String }, // Razorpay payment id
    enrollmentPaidAt: { type: Date },
    semesters: [semesterPaymentSchema],
}, {
    timestamps: true,
});

const MyProgram = mongoose.model('MyProgram', myProgramSchema);
export default MyProgram; 