import { SES } from 'aws-sdk';
import type { SendEmailRequest } from 'aws-sdk/clients/ses';

const ses = new SES({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
console.log(process.env.AWS_REGION, process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);

export const sendEmail = async (params: SendEmailRequest): Promise<void> => {
  try {
    console.log('SES Configuration:', {
      region: process.env.AWS_REGION,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
    });
    
    console.log('Attempting to send email with params:', {
      to: params.Destination.ToAddresses,
      subject: params.Message.Subject.Data
    });

    const result = await ses.sendEmail(params).promise();
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Detailed SES error:', error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
