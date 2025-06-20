import { Elysia } from 'elysia';
import { signup, login } from '../controllers/authController';
import { forgotPassword, resetPassword } from '../controllers/passwordResetController';
import { initiateRegistration, verifyRegistrationOtp, resendOtp } from '../controllers/registerWithOtpController';

const authRoutes = new Elysia({ prefix: '/auth' })
  .post('/signup', signup)
  .post('/login', login)
  .post('/forgot-password', async (context) => {
    console.log('Forgot password request received:', context.body);
    return await forgotPassword(context);
  })
  .post('/reset-password/:token', resetPassword)
  .post('/register/initiate', initiateRegistration)
  .post('/register/verify-otp', verifyRegistrationOtp)
  .post('/register/resend-otp', resendOtp);

export default authRoutes;
