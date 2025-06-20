export function emailOtpTemplate(userName: string, otpCode: string) {
  return {
    Subject: { Data: 'Your OTP for NextGen Learning App Verification' },
    Body: {
      Html: {
        Data: `
          <p>Hi ${userName},</p>
          <p>Thank you for using NextGen Learning App!</p>
          <p>To verify your identity, please use the One-Time Password (OTP) provided below:</p>
          <h2>🔐 OTP: ${otpCode}</h2>
          <p>This OTP is valid for 10 minutes and can only be used once.</p>
          <p>If you did not request this OTP, please ignore this message or contact our support team.</p>
          <hr>
          <b>Security Tip:</b> Never share your OTP with anyone. We will never ask for it.<br>
          <b>Need Help?</b> Reach out to our support team at: info.cce@iitmandi.ac.in
          <br><br>Thanks,<br>Team NextGen Learning App
        `
      }
    }
  };
}

export function smsOtpTemplate(userName: string, otp: string) {
  console.log(userName, otp);
  return `Hi ${userName}, Your OTP for verifying your account on NextGen Learning App is: ${otp}. This OTP is valid for 10 minutes. Please do not share it with anyone. For any support, contact us at info.cce@iitmandi.ac.in - NextGen Learning App`;
}
