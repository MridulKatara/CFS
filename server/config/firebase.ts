import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Initialize Firebase Admin with service account or environment variables
let firebaseInitialized = false;

try {
  // Check if service account file exists
  const serviceAccountPath = path.resolve(__dirname, '../service-account-key.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    // Use service account file
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firebaseInitialized = true;
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Use environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firebaseInitialized = true;
  } else {
    console.warn('Firebase service account not found. Push notifications will not work.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
}

// Export messaging if Firebase is initialized
export const messaging = firebaseInitialized ? admin.messaging() : null;

// Helper function to safely send messages
export const sendMulticast = async (message: any) => {
  if (!firebaseInitialized || !messaging) {
    console.warn('Firebase not initialized. Cannot send push notification.');
    return { successCount: 0, failureCount: 0 };
  }
  
  try {
    // Handle multicast messages (with tokens array)
    if (message.tokens && Array.isArray(message.tokens)) {
      // We need to use the admin.messaging() instance directly
      const result = await admin.messaging().sendEachForMulticast({
        tokens: message.tokens,
        notification: message.notification,
        data: message.data
      });
      return result;
    } else {
      // Handle single message
      await messaging.send(message);
      return { successCount: 1, failureCount: 0 };
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { successCount: 0, failureCount: 1 };
  }
};

export default admin;
