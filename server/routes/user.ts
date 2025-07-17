import { Elysia } from 'elysia';
import { getProfile, updateProfile, updatePassword, getMyPrograms } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { createOrder, verifyPayment, uploadPaymentReceipt, getPaymentHistory } from '../controllers/paymentController';
import Program from '../models/Program';
import MyProgram from '../models/MyProgram';

const userRoutes = new Elysia({ prefix: '/user' })
  .use(authMiddleware)
  .get('/profile', getProfile)
  .put('/profile', updateProfile)
  .put('/password', updatePassword)
  .get('/my-programs', getMyPrograms)
  .post('/payment/order', createOrder)
  .post('/payment/verify', verifyPayment)
  .post('/payment/upload-receipt', uploadPaymentReceipt)
  .get('/payment/history', getPaymentHistory)
  .get('/programs', async ({ user }) => {
    try {
      // Get all available programs
      const allPrograms = await Program.find({});
      
      // Get user's enrolled programs
      const myPrograms = await MyProgram.find({ userId: user._id });
      const enrolledProgramIds = myPrograms.map(p => p.programId.toString());
      
      // Format programs for response, marking which ones the user is enrolled in
      const formattedPrograms = allPrograms.map(program => {
        // Check if user is enrolled in this program
        const isEnrolled = enrolledProgramIds.includes(program._id.toString());
        const userProgram = myPrograms.find(p => p.programId.toString() === program._id.toString());
        
        // Determine enrollment status
        let enrollmentStatus = 'not_enrolled';
        let paymentStatus = null;
        
        if (userProgram) {
          if (userProgram.enrollmentStatus === 'verified') {
            enrollmentStatus = 'enrolled';
            paymentStatus = 'paid';
          } else if (userProgram.enrollmentStatus === 'pending_verification') {
            enrollmentStatus = 'pending_verification';
            paymentStatus = 'pending_verification';
          } else if (userProgram.enrollmentStatus === 'rejected') {
            enrollmentStatus = 'rejected';
            paymentStatus = 'rejected';
          }
        }
        
        return {
          _id: program._id,
          name: program.programName,
          title: program.programName,
          description: program.detail,
          totalSemesters: 6,
          currentSemester: userProgram?.semesters.length || 1,
          progress: userProgram?.semesters.filter(s => s.paid).length || 0,
          mode: "Online",
          status: enrollmentStatus === 'enrolled' ? "active" : "inactive",
          isEnrolled: enrollmentStatus === 'enrolled',
          enrollmentStatus: enrollmentStatus,
          paymentStatus: paymentStatus
        };
      });
      
      return {
        success: true,
        data: formattedPrograms
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch programs"
      };
    }
  });

export default userRoutes;


