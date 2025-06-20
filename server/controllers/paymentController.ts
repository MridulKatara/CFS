import razorpay from '../config/razorpay';
import Payment from '../models/Payment';
import MyProgram from '../models/MyProgram';
import Program from '../models/Program';

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