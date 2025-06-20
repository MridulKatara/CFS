import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    programId: { type: String, required: true },
    type: { type: String, enum: ['enrollment', 'semester'], required: true },
    semesterName: { type: String }, // Only for semester payments
    amount: { type: Number, required: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
    paidAt: { type: Date },
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment; 