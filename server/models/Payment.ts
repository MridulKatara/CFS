import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    programId: { type: String, required: true },
    type: { type: String, enum: ['enrollment', 'semester'], required: true },
    semesterName: { type: String }, // Only for semester payments
    amount: { type: Number, required: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: { type: String, enum: ['created', 'paid', 'failed', 'pending_verification'], default: 'created' },
    paidAt: { type: Date },
    // File upload fields
    receiptFile: {
        url: { type: String },
        key: { type: String },
        originalName: { type: String },
        uploadedAt: { type: Date }
    },
    paymentMethod: { type: String, enum: ['razorpay', 'manual_upload'], default: 'razorpay' },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment; 