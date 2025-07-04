import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Initialize Firebase Admin with service account or environment variables
let firebaseInitialized = false;

try {
  // Direct initialization with the service account details
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "nextgenlearning-1",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC+b4817zIVWv/G\naPWuivHNJfdLTaFkpMtWFbYmhi+GrYAVRI+qH98nLuhHqclEg1Gq8P/2xVQiG0/M\nCHq+iS0WjXAJhlUUlwAPKXqEDoXVYadj0di2xEhTd0Y+cED190FxNaM07d9sEiyP\nFv9KHnfJrTnR9j35V72YirxtwXDPbTELmeSR+/1yiXc7CRlP9n4uAUcQj9+F41z0\nORcD06PRTMbOd5mgSoPY8t1skQapFlaDmLlg71D/jtBnoyusRLR9L84gg8sJlax7\niBjEYxgI/pZtDfgJ24Ciyy/YY+7P5314QCiCsdnF+ke+mU3TGRFzHRVYlURCiON9\nIIRbAYdtAgMBAAECggEAL5Yf8qnFWZnGLVXAArAcsRdKHsqUyFn3p5jATgsc6CoF\nxgq+XZQeRqPNjk7KiPDJoQ4c4BS6K9WoUINT7LXJiwen1fF35C/BZ4iFYWdhoQsI\ncYSYAz+0FQtKhcK2MOBqvXfaQxknydEWymDERUisxTwgpStDnEGFEo+ke0apwmMG\n4pU89X6YldrHcexFt7MXzXYdLYcO7lXpwV+612K8kNilUwMQmqB6RSQxgApGI3Fu\ncbqlqcoHNksBqHvO6vvXhBzt++IvCrJfKXgZV3X1b1bQdbVbqyc0iVOVYW8DQG8B\nkhgRP67xK2EEkxOy0XZS3JiCJ7qGUQTC1/W+CRa8fwKBgQD7mQ5+fW7D38t1LpCC\nr3pYY9g/8rPa07Y4DtwehX51WNBMp4su+7Dcsr4R16qOsv8/NPisgOw0700Z2nbh\nMzRsUJtO5IUHhQhnasLYRTK691bfPgD5XrxvWLO1ywJLdTQlWEJo3p1sTHVwE9BA\nM5ZYr2Uh+1efG2NfU1GP2R5quwKBgQDBxIyECyHmrTmnVwh07KXUqm+k1cagWteI\nf+MjWuS3fDYRN/7cVyhARayhDvutu4Xyv7LvhNOof23d69OEdrD3AT+i5uwfodML\nzrJ3DVfSHC3zuA3HQJUWXI8pP9f6eyAc2qUR4LbFFoB9V9I9Hm8HKTpdpL9OKseh\ntmMV4nlX9wKBgDmqegz52OJiL/Laylp5t9P8hnsZuKlmLvSoS0FfnX1t7sgy+o65\nN29ONIxIXxo34pLtJDX9kqYLVyOe0/KH1vMggohRjkAL+MIjUSdarOb3e9zNDFIb\nqZrnvMDlF9CNu3b3xLjelTxWRfB7Shb8+++1u7tPLWUVVPBrW11aCUOzAoGAO3vy\nQysDukQdeeC/CN4JPpMf+PNjqaCZoB7ahOUHZ8iq9HhDNjNPeQOqrjriSoBR66ar\n8NnO/GA6QzF9WqHxS7LHbWQEwuUz2+EVanTfK/JYrQQovq1110qM7HXcANpBjnoU\nyLs6gKCay1/le7vXC9S9RTgpPn7lkCBkpLhE1hsCgYBiF0Z8ytZGEyoX2WHF//We\nFerlR/NFHdK8jqklP1cy7NZIQv5bVUUjV2p03MNfR7XiaM9bLWpsEtOqfttFZz/2\nsLEPzYuwFlWK732pnI677bVuS/5FLN68bwmMd6q2csQwV79E/sbxPkHlPDWwldfa\n65ZRYrNuALCTRb8+2OVQPA==\n-----END PRIVATE KEY-----\n",
      clientEmail: "firebase-adminsdk-fbsvc@nextgenlearning-1.iam.gserviceaccount.com"
    })
  });
  firebaseInitialized = true;
  console.log('✅ Firebase initialized successfully with hardcoded credentials');
} catch (error) {
  console.error('❌ Failed to initialize Firebase:', error);
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
