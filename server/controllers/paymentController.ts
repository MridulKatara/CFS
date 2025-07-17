import razorpay from '../config/razorpay';
import Payment from '../models/Payment';
import MyProgram from '../models/MyProgram';
import Program from '../models/Program';
import { uploadFileToS3 } from '../utils/s3Utils';

// Create a Razorpay order
export const createOrder = async (ctx: any) => {
    try {
        const { amount, currency = 'INR', type, programId, semesterName } = ctx.body;
        const options = {
            amount: amount * 100, // amount in paise
            currency,
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        // Save to Payment collection
        const payment = await Payment.create({
            userId: ctx.user._id,
            programId,
            type,
            semesterName,
            amount,
            razorpayOrderId: order.id,
            status: 'created',
        });
        return { success: true, order, paymentId: payment._id };
    } catch (error: any) {
        throw new Error(error.message || 'Error creating order');
    }
};

// Verify payment and update status
export const verifyPayment = async (ctx: any) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, programId, type, semesterName } = ctx.body;
        // Update Payment record
        const payment = await Payment.findOneAndUpdate(
            { razorpayOrderId },
            { status: 'paid', razorpayPaymentId, paidAt: new Date() },
            { new: true }
        );
        if (!payment) throw new Error('Payment record not found');

        // Update MyProgram accordingly
        if (type === 'enrollment') {
            // Mark enrollment fee as paid
            await MyProgram.findOneAndUpdate(
                { userId: ctx.user._id, programId },
                { enrollmentFeePaid: true, enrollmentPaymentId: razorpayPaymentId, enrollmentPaidAt: new Date() },
                { upsert: true }
            );
        } else if (type === 'semester' && semesterName) {
            // Mark semester as paid
            await MyProgram.findOneAndUpdate(
                { userId: ctx.user._id, programId, 'semesters.semesterName': semesterName },
                { $set: { 'semesters.$.paid': true, 'semesters.$.paymentId': razorpayPaymentId, 'semesters.$.paidAt': new Date() } },
                { upsert: false }
            );
        }
        return { success: true };
    } catch (error: any) {
        throw new Error(error.message || 'Error verifying payment');
    }
};

// Upload payment receipt
export const uploadPaymentReceipt = async (ctx: any) => {
    try {
        const { programId, type, semesterName, amount, fileData, fileName, fileType } = ctx.body;

        if (!fileData || !fileName) {
            throw new Error('No file uploaded');
        }

        // Convert base64 to buffer
        const fileBuffer = Buffer.from(fileData, 'base64');

        // Upload file to S3
        const uploadResult = await uploadFileToS3(
            fileBuffer,
            fileName,
            fileType || 'application/octet-stream',
            ctx.user._id.toString(),
            programId
        );

        if (!uploadResult.success) {
            throw new Error(uploadResult.error || 'Failed to upload file');
        }

        // Create payment record with manual upload
        const payment = await Payment.create({
            userId: ctx.user._id,
            programId,
            type,
            semesterName,
            amount,
            status: 'pending_verification',
            paymentMethod: 'manual_upload',
            receiptFile: {
                url: uploadResult.url,
                key: uploadResult.key,
                originalName: fileName,
                uploadedAt: new Date()
            },
            paidAt: new Date()
        });

        // Update MyProgram accordingly - enroll user immediately
        if (type === 'enrollment') {
            await MyProgram.findOneAndUpdate(
                { userId: ctx.user._id, programId },
                { 
                    enrollmentFeePaid: true, 
                    enrollmentPaymentId: payment._id.toString(), 
                    enrollmentPaidAt: new Date(),
                    // Add enrollment status
                    enrollmentStatus: 'pending_verification'
                },
                { upsert: true }
            );
        } else if (type === 'semester' && semesterName) {
            await MyProgram.findOneAndUpdate(
                { userId: ctx.user._id, programId, 'semesters.semesterName': semesterName },
                { 
                    $set: { 
                        'semesters.$.paid': true, 
                        'semesters.$.paymentId': payment._id.toString(), 
                        'semesters.$.paidAt': new Date(),
                        'semesters.$.status': 'pending_verification'
                    } 
                },
                { upsert: false }
            );
        }

        return { 
            success: true, 
            message: 'Payment receipt uploaded successfully. Pending verification.',
            paymentId: payment._id 
        };
    } catch (error: any) {
        throw new Error(error.message || 'Error uploading payment receipt');
    }
};

// Get payment history for user
export const getPaymentHistory = async (ctx: any) => {
    try {
        const payments = await Payment.find({ userId: ctx.user._id })
            .sort({ createdAt: -1 })
            .populate('verifiedBy', 'fullName');

        return {
            success: true,
            payments: payments.map(payment => ({
                id: payment._id,
                programId: payment.programId,
                type: payment.type,
                semesterName: payment.semesterName,
                amount: payment.amount,
                status: payment.status,
                paymentMethod: payment.paymentMethod,
                receiptFile: payment.receiptFile,
                verified: payment.verified,
                paidAt: payment.paidAt,
                createdAt: payment.createdAt
            }))
        };
    } catch (error: any) {
        throw new Error(error.message || 'Error fetching payment history');
    }
}; 