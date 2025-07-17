import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Configure AWS S3
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'smart-lms';

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export const uploadFileToS3 = async (
  file: Buffer,
  originalName: string,
  contentType: string,
  userId: string,
  programId: string
): Promise<UploadResult> => {
  try {
    // Generate unique file key
    const fileExtension = originalName.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = `payments/${userId}/${programId}/${fileName}`;

    // Sanitize metadata values to remove invalid characters
    const sanitizeMetadata = (value: string) => {
      return value.replace(/[^\w\-\.]/g, '_');
    };

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      Metadata: {
        originalName: sanitizeMetadata(originalName),
        userId: sanitizeMetadata(userId),
        programId: sanitizeMetadata(programId),
        uploadedAt: new Date().toISOString().replace(/[^\w\-\.]/g, '_'),
      },
    };

    const result = await s3.upload(uploadParams).promise();
    
    return {
      success: true,
      url: result.Location,
      key: result.Key,
    };
  } catch (error: any) {
    console.error('S3 upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload file to S3',
    };
  }
};

export const deleteFileFromS3 = async (key: string): Promise<boolean> => {
  try {
    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(deleteParams).promise();
    return true;
  } catch (error: any) {
    console.error('S3 delete error:', error);
    return false;
  }
}; 