import User from '../models/User';
import Payment from '../models/Payment';
import MyProgram from '../models/MyProgram';

export const getAllUsers = async () => {
  try {
    const users = await User.find({})
      .select('-password')
      .lean();
    
    return {
      success: true,
      users
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error fetching users');
  }
};

// Get pending payment verifications
export const getPendingPayments = async () => {
  try {
    const payments = await Payment.find({ status: 'pending_verification' })
      .populate('userId', 'fullName personalEmail mobileNumber')
      .sort({ createdAt: -1 })
      .lean();
    
    return {
      success: true,
      payments
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error fetching pending payments');
  }
};

// Verify payment
export const verifyPayment = async ({ body, user }: any) => {
  try {
    console.log('Verifying payment with data:', body);
    const { paymentId, verified, reason } = body;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    console.log('Found payment:', payment);

    if (verified) {
      // Mark payment as verified and paid
      payment.status = 'paid';
      payment.verified = true;
      payment.verifiedAt = new Date();
      payment.verifiedBy = user._id;
      
      // Update MyProgram enrollment status
      if (payment.type === 'enrollment') {
        console.log('Updating enrollment status to verified for:', {
          userId: payment.userId,
          programId: payment.programId
        });
        
        const result = await MyProgram.findOneAndUpdate(
          { userId: payment.userId, programId: payment.programId },
          { enrollmentStatus: 'verified' },
          { new: true }
        );
        
        console.log('Updated MyProgram result:', result);
      } else if (payment.type === 'semester' && payment.semesterName) {
        const result = await MyProgram.findOneAndUpdate(
          { userId: payment.userId, programId: payment.programId, 'semesters.semesterName': payment.semesterName },
          { $set: { 'semesters.$.status': 'verified' } },
          { new: true }
        );
        
        console.log('Updated semester status result:', result);
      }
    } else {
      // Reject payment
      payment.status = 'failed';
      payment.verified = false;
      payment.verifiedAt = new Date();
      payment.verifiedBy = user._id;
      
      // Update MyProgram enrollment status and remove from program if enrollment fee
      if (payment.type === 'enrollment') {
        await MyProgram.findOneAndUpdate(
          { userId: payment.userId, programId: payment.programId },
          { 
            enrollmentStatus: 'rejected',
            enrollmentFeePaid: false,
            enrollmentPaymentId: null,
            enrollmentPaidAt: null
          }
        );
      } else if (payment.type === 'semester' && payment.semesterName) {
        await MyProgram.findOneAndUpdate(
          { userId: payment.userId, programId: payment.programId, 'semesters.semesterName': payment.semesterName },
          { 
            $set: { 
              'semesters.$.status': 'rejected',
              'semesters.$.paid': false,
              'semesters.$.paymentId': null,
              'semesters.$.paidAt': null
            } 
          }
        );
      }
    }

    await payment.save();

    return {
      success: true,
      message: verified ? 'Payment verified successfully' : 'Payment rejected'
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error verifying payment');
  }
};
