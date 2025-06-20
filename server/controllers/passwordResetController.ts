import type { Context } from 'elysia';
import User from '../models/User';
import { generateResetToken, verifyResetToken } from '../utils/jwt';
import { sendEmail } from '../utils/sesUtils';
import resetPasswordParams from '../utils/resetPasswordParams';

export const forgotPassword = async ({ body }: Context) => {
  try {
    console.log('Forgot password controller - Request body:', body);
    const { personalEmail } = body as { personalEmail: string };
    
    console.log('Looking for user with email:', personalEmail);
    const user = await User.findOne({ personalEmail });
    if (!user) {
      console.log('User not found for email:', personalEmail);
      throw new Error('User not found');
    }

    console.log('User found, generating reset token');
    const resetToken = generateResetToken(user._id.toString());
    
    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log('Reset password link generated:', resetPasswordLink);
    
    const emailParams = resetPasswordParams(
      user.personalEmail,
      user.fullName,
      resetPasswordLink
    );
    console.log('Email params prepared:', {
      to: emailParams.Destination.ToAddresses,
      subject: emailParams.Message.Subject.Data
    });
    
    console.log('Attempting to send email...');
    await sendEmail(emailParams);
    console.log('Email sent successfully');

    return {
      success: true,
      message: 'Password reset link sent successfully'
    };
  } catch (error: any) {
    console.error('Error in forgotPassword controller:', error);
    throw new Error(error.message || 'Failed to send reset link');
  }
};

export const resetPassword = async ({ body, params }: Context) => {
  try {
    const { token } = params as { token: string };
    const { password } = body as { password: string };

    // Verify reset token and get user ID
    const decoded = verifyResetToken(token);
    if (!decoded || !decoded.userId) {
      throw new Error('Invalid or expired token');
    }

    // Find user and update password
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update password
    user.password = password;
    await user.save();

    return {
      success: true,
      message: 'Password reset successful'
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to reset password');
  }
};
