import type { SendEmailRequest } from 'aws-sdk/clients/ses';

const resetPasswordParams = (email: string, name: string, resetPasswordLink: string): SendEmailRequest => {
  return {
    Source: 'operations@masaischool.com',
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<div style="background-color: #008CBA; padding: 20px;">
            <div style="background-color: #f2f2f2; padding: 20px; border: 1px solid #ddd;">
              <p style="color: #008CBA; font-size: 18px;">Hi ${name},</p>
              <p style="color: #333; font-size: 16px;">You've recently made a request to reset your password on the Masai Platform. Please click on the following button to reset your password:</p>
              <button style="background-color: #fff; color: #008CBA; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                <a href="${resetPasswordLink}" style="color: #008CBA; text-decoration: none;">Reset Password</a>
              </button>
              <p style="color: #333; font-size: 14px;">Regards,<br>
              Masai School | Course</p>
              <hr>
              <p style="color: #333; font-size: 16px;">If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</p>
              <p style="color: #333; font-size: 16px;"><a href="${resetPasswordLink}" style="color: #008CBA; text-decoration: none;">${resetPasswordLink}</a></p>
            </div>
          </div>`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Request for Password Reset',
      },
    },
  };
};

export default resetPasswordParams;
