import type { Context } from 'elysia';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import OtpVerification from '../models/OtpVerification';
import { generateOtp, hashOtp } from '../utils/otpUtils';
import { sendEmail } from '../utils/sesUtils';
import { emailOtpTemplate, smsOtpTemplate } from '../utils/otpTemplates';
import bcrypt from 'bcryptjs';

interface SignupBody {
  fullName: string;
  personalEmail: string;
  universityName: string;
  // enrollmentId: string;
  program: string;
  currentSemester: number;
  branch: string;
  password: string;
  mobile: string;
}

interface LoginBody {
  personalEmail: string;
  password: string;
}

export const signup = async ({ body }: any) => {
  const { fullName, personalEmail, universityName, program, currentSemester, branch, password, mobileNumber } = body;

  // Check OTP doc is verified
  const otpDoc = await OtpVerification.findOne({ email: personalEmail, mobileNumber, verified: true });
  if (!otpDoc) throw new Error('OTP not verified or expired');

  // Check if user already exists
  if (await User.findOne({ $or: [{ personalEmail }, { mobileNumber }] })) {
    throw new Error('User with this email or mobile already exists');
  }

  // Create user
  await User.create({
    fullName,
    personalEmail,
    universityName,
    program,
    currentSemester,
    branch,
    password,
    mobileNumber,
  });

  // Delete OTP doc
  await OtpVerification.deleteOne({ email: personalEmail, mobileNumber });

  return { success: true };
};

export const login = async ({ body }: Context) => {
  try {
    const user = await User.findOne({ personalEmail: body.personalEmail });
    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }

    // Use the model's comparePassword method
    const isMatch = await user.comparePassword(body.password);
    if (!isMatch) {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }

    const token = generateToken(user._id.toString(), user.role);

    return {
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.personalEmail,
          role: user.role
        },
        token
      }
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error during login');
  }
};
