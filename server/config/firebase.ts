import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin with service account
let firebaseInitialized = false;

// Debug logs to verify environment variables are available
console.log('ENV CHECK - FIREBASE_PROJECT_ID exists:', !!process.env.FIREBASE_PROJECT_ID);
console.log('ENV CHECK - FIREBASE_CLIENT_EMAIL exists:', !!process.env.FIREBASE_CLIENT_EMAIL);
console.log('ENV CHECK - FIREBASE_PRIVATE_KEY exists:', !!process.env.FIREBASE_PRIVATE_KEY);

try {
  // First check for environment variables (recommended for production/deployment)
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      } as admin.ServiceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    firebaseInitialized = true;
    console.log('✅ Firebase initialized successfully with individual environment variables');
  } 
  else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Use the environment variable with the full JSON credentials
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      // Check if service account has the required fields
      if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT is missing required fields');
      }
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: serviceAccount.project_id,
          privateKey: serviceAccount.private_key,
          clientEmail: serviceAccount.client_email
        } as admin.ServiceAccount),
        projectId: serviceAccount.project_id
      });
      
      console.log('✅ Firebase initialized successfully with FIREBASE_SERVICE_ACCOUNT');
      firebaseInitialized = true;
    } catch (parseError) {
      console.error('❌ Failed to initialize with FIREBASE_SERVICE_ACCOUNT:', parseError);
      console.error('Please ensure the FIREBASE_SERVICE_ACCOUNT environment variable contains valid JSON');
    }
  }
  else {
    // Try to find the service account file
    const serviceAccountPath = path.resolve(__dirname, '../service-account-key.json');
    
    if (fs.existsSync(serviceAccountPath)) {
      // Initialize with the service account file
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
        projectId: "nextgenlearning-1"
      });
      firebaseInitialized = true;
      console.log('✅ Firebase initialized successfully with service account file');
    } else {
      console.error('❌ No Firebase credentials available - notifications will not work');
      console.error('Please set either:');
      console.error('1. FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL environment variables');
      console.error('2. FIREBASE_SERVICE_ACCOUNT environment variable with the full service account JSON');
      console.error('3. Place service-account-key.json in the server directory');
    }
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase:', error);
}

// Helper function to delay execution (for retry logic)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Send notification to web clients with retry logic
export const sendNotificationToWeb = async (fcmTokens: string[], title: string, body: string, clickActionUrl: string = '/notification', maxRetries = 3) => {
  
  if (!firebaseInitialized) {
    console.warn('Firebase not initialized. Cannot send push notification.');
    return { successCount: 0, failureCount: fcmTokens.length };
  }

  // Filter out invalid tokens
  const validTokens = fcmTokens.filter(token => typeof token === 'string' && token.length > 20);
  
  if (validTokens.length === 0) {
    console.warn('No valid tokens to send notifications to');
    return { successCount: 0, failureCount: 0 };
  }

  const message: admin.messaging.MulticastMessage = {
    tokens: validTokens,
    notification: {
      title,
      body,
    },
    data: {
      url: clickActionUrl,
    },
    webpush: {
      notification: {
        icon: '/icon-192x192.png',
      },
      fcmOptions: {
        link: clickActionUrl
      }
    },
  };
  console.log('message', message);

  try {
    console.log('Sending notification to', validTokens.length, 'devices');
    // Use sendEachForMulticast instead of sendMulticast
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Successfully sent message: ${response.successCount} success, ${response.failureCount} failure`);
    
    // Add detailed error logging
    if (response.failureCount > 0 && response.responses) {
      for (let i = 0; i < response.responses.length; i++) {
        if (!response.responses[i].success) {
          const errorCode = response.responses[i].error?.code;
          if (errorCode === 'messaging/registration-token-not-registered') {
            // Flag this token for removal from your database
            console.log(`Token ${validTokens[i].substring(0, 10)}... is invalid and should be removed`);
            
            // Here you'd typically call a function to remove this token from your database
            // For example: await removeInvalidToken(validTokens[i]);
          }
        }
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    return { successCount: 0, failureCount: validTokens.length };
  }
};

// Legacy function for backward compatibility
export const sendMulticast = async (message: any) => {
  if (!firebaseInitialized) {
    console.warn('Firebase not initialized. Cannot send push notification.');
    return { successCount: 0, failureCount: 0 };
  }
  
  try {
    const fcmMessage: admin.messaging.MulticastMessage = {
      tokens: message.tokens,
      notification: message.notification,
      data: message.data,
      webpush: {
        notification: {
          icon: '/icon-192x192.png',
        },
        fcmOptions: {
          link: message.data?.url || '/notification'
        }
      }
    };

    // Use sendEachForMulticast instead of sendMulticast
    const response = await admin.messaging().sendEachForMulticast(fcmMessage);
    return response;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { successCount: 0, failureCount: message.tokens?.length || 0 };
  }
};

export default admin;
