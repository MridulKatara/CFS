import User from '../models/User';
import OtpVerification from '../models/OtpVerification';
import { generateOtp, hashOtp, compareOtp } from '../utils/otpUtils';
import { emailOtpTemplate, smsOtpTemplate } from '../utils/otpTemplates';
import { sendEmail } from '../utils/sesUtils';
import { sendSms } from '../utils/smsUtils';

export const initiateRegistration = async ({ body }: any) => {
  const { fullName, personalEmail, mobileNumber, universityName, program, branch, password, currentSemester } = body;
  
  // 1. Check if user exists
  if (await User.findOne({ $or: [{ personalEmail }, { mobileNumber }] })) {
    throw new Error('User with this email, mobile, or enrollment ID already exists');
  }

  // Store user data in OtpVerification for later use
  const userData = {
    fullName,
    personalEmail,
    mobileNumber,
    universityName,
    program,
    branch,
    currentSemester,
    password // Store hashed password here
  };

  // 2. Generate OTPs
  const otpEmail = generateOtp();
  const otpMobile = generateOtp();
  
  // 3. Hash OTPs
  const hashedEmail = await hashOtp(otpEmail);
  const hashedMobile = await hashOtp(otpMobile);
  
  // 4. Store in OtpVerification (upsert)
  let otpDoc = await OtpVerification.findOne({ 'email': personalEmail });
  if (!otpDoc) {
    otpDoc = await OtpVerification.create({
      email: personalEmail,
      mobileNumber,
      otpEmail: hashedEmail,
      otpMobile: hashedMobile,
      emailAttempts: 1,
      mobileAttempts: 1,
      userData: userData // Store the complete user data
    });
  } else {
    otpDoc.otpEmail = hashedEmail;
    otpDoc.otpMobile = hashedMobile;
    otpDoc.emailAttempts += 1;
    otpDoc.mobileAttempts += 1;
    otpDoc.userData = userData;
    otpDoc.createdAt = new Date();
    await otpDoc.save();
  }

  // 5. Send OTPs
  await sendEmail({
    Source: 'info.cce@iitmandi.ac.in',
    Destination: { ToAddresses: [personalEmail] },
    Message: emailOtpTemplate(fullName, otpEmail),
  });
  await sendSms(mobileNumber, smsOtpTemplate(fullName, otpMobile));

  return { success: true };
};

export const verifyRegistrationOtp = async ({ body }: any) => {
  const { email, mobileNumber, otpEmail, otpMobile } = body;
  
  const otpDoc = await OtpVerification.findOne({ email, mobileNumber });
  if (!otpDoc) throw new Error('OTP not found or expired');

  let emailValid = false, mobileValid = false;
  if (otpEmail) emailValid = await compareOtp(otpEmail, otpDoc.otpEmail);
  if (otpMobile) mobileValid = await compareOtp(otpMobile, otpDoc.otpMobile);

  if (!emailValid && !mobileValid) throw new Error('Both OTPs are incorrect');
  if (!emailValid) return { success: false, error: 'otpEmail' };
  if (!mobileValid) return { success: false, error: 'otpMobile' };

  // Create the user after OTP verification
  const userData = otpDoc.userData;
  await User.create(userData);

  // Delete OTP doc after successful verification and user creation
  await OtpVerification.deleteOne({ _id: otpDoc._id });

  return { success: true };
};

export const resendOtp = async ({ body }: any) => {
  const { email, mobileNumber, type } = body;
  
  // Find the OTP document
  const otpDoc = await OtpVerification.findOne({ email, mobileNumber });
  if (!otpDoc) throw new Error('OTP verification session expired. Please start registration again.');

  // Check attempt limits based on type
  if (type === 'email' && otpDoc.emailAttempts >= 3) {
    throw new Error('Maximum email OTP attempts reached. Please try again after some time.');
  }
  if (type === 'mobile' && otpDoc.mobileAttempts >= 3) {
    throw new Error('Maximum mobile OTP attempts reached. Please try again after some time.');
  }

  // Generate and send new OTPs based on type
  if (type === 'email' || type === 'both') {
    const newEmailOtp = generateOtp();
    otpDoc.otpEmail = await hashOtp(newEmailOtp);
    otpDoc.emailAttempts += 1;
    
    // Send email OTP
    await sendEmail({
      Source: 'info.cce@iitmandi.ac.in',
      Destination: { ToAddresses: [email] },
      Message: emailOtpTemplate(otpDoc.userData.fullName || 'User', newEmailOtp),
    });
  }

  if (type === 'mobile' || type === 'both') {
    const newMobileOtp = generateOtp();
    otpDoc.otpMobile = await hashOtp(newMobileOtp);
    otpDoc.mobileAttempts += 1;
    
    // Send SMS OTP
    await sendSms(mobileNumber, smsOtpTemplate(otpDoc.userData.fullName || 'User', newMobileOtp));
  }

  // Update the document with new OTP and attempt count
  otpDoc.createdAt = new Date(); // Reset the expiry timer
  await otpDoc.save();

  return { 
    success: true,
    message: `OTP resent successfully to your ${type === 'both' ? 'email and phone' : type}`
  };
};
