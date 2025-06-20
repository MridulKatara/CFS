import AWS from 'aws-sdk';

const sns = new AWS.SNS({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function sendSms(mobile: string, message: string) {
  if (!mobile.startsWith('+')) {
    mobile = '+91' + mobile;
  }
  const params = {
    Message: message,
    PhoneNumber: mobile,
  };
  try {
    const result = await sns.publish(params).promise();
    return result;
  } catch (error) {
    console.error('AWS SNS SMS error:', error);
    throw new Error('Failed to send SMS');
  }
}
