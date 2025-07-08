import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Initialize Firebase Admin with service account
let firebaseInitialized = false;

try {
  // Get the service account file path
  const serviceAccountPath = path.resolve(__dirname, '../service-account-key.json');
  
  // Check if the service account file exists
  if (fs.existsSync(serviceAccountPath)) {
    // Initialize with the service account file
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      projectId: "nextgenlearning-1"
    });
    firebaseInitialized = true;
    console.log('✅ Firebase initialized successfully with service account file');
  } else {
    // Fallback to direct initialization if file not found
    const serviceAccount = {
      projectId: "nextgenlearning-1",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC+b4817zIVWv/G\naPWuivHNJfdLTaFkpMtWFbYmhi+GrYAVRI+qH98nLuhHqclEg1Gq8P/2xVQiG0/M\nCHq+iS0WjXAJhlUUlwAPKXqEDoXVYadj0di2xEhTd0Y+cED190FxNaM07d9sEiyP\nFv9KHnfJrTnR9j35V72YirxtwXDPbTELmeSR+/1yiXc7CRlP9n4uAUcQj9+F41z0\nORcD06PRTMbOd5mgSoPY8t1skQapFlaDmLlg71D/jtBnoyusRLR9L84gg8sJlax7\niBjEYxgI/pZtDfgJ24Ciyy/YY+7P5314QCiCsdnF+ke+mU3TGRFzHRVYlURCiON9\nIIRbAYdtAgMBAAECggEAL5Yf8qnFWZnGLVXAArAcsRdKHsqUyFn3p5jATgsc6CoF\nxgq+XZQeRqPNjk7KiPDJoQ4c4BS6K9WoUINT7LXJiwen1fF35C/BZ4iFYWdhoQsI\ncYSYAz+0FQtKhcK2MOBqvXfaQxknydEWymDERUisxTwgpStDnEGFEo+ke0apwmMG\n4pU89X6YldrHcexFt7MXzXYdLYcO7lXpwV+612K8kNilUwMQmqB6RSQxgApGI3Fu\ncbqlqcoHNksBqHvO6vvXhBzt++IvCrJfKXgZV3X1b1bQdbVbqyc0iVOVYW8DQG8B\nkhgRP67xK2EEkxOy0XZS3JiCJ7qGUQTC1/W+CRa8fwKBgQD7mQ5+fW7D38t1LpCC\nr3pYY9g/8rPa07Y4DtwehX51WNBMp4su+7Dcsr4R16qOsv8/NPisgOw0700Z2nbh\nMzRsUJtO5IUHhQhnasLYRTK691bfPgD5XrxvWLO1ywJLdTQlWEJo3p1sTHVwE9BA\nM5ZYr2Uh+1efG2NfU1GP2R5quwKBgQDBxIyECyHmrTmnVwh07KXUqm+k1cagWteI\nf+MjWuS3fDYRN/7cVyhARayhDvutu4Xyv7LvhNOof23d69OEdrD3AT+i5uwfodML\nzrJ3DVfSHC3zuA3HQJUWXI8pP9f6eyAc2qUR4LbFFoB9V9I9Hm8HKTpdpL9OKseh\ntmMV4nlX9wKBgDmqegz52OJiL/Laylp5t9P8hnsZuKlmLvSoS0FfnX1t7sgy+o65\nN29ONIxIXxo34pLtJDX9kqYLVyOe0/KH1vMggohRjkAL+MIjUSdarOb3e9zNDFIb\nqZrnvMDlF9CNu3b3xLjelTxWRfB7Shb8+++1u7tPLWUVVPBrW11aCUOzAoGAO3vy\nQysDukQdeeC/CN4JPpMf+PNjqaCZoB7ahOUHZ8iq9HhDNjNPeQOqrjriSoBR66ar\n8NnO/GA6QzF9WqHxS7LHbWQEwuUz2+EVanTfK/JYrQQovq1110qM7HXcANpBjnoU\nyLs6gKCay1/le7vXC9S9RTgpPn7lkCBkpLhE1hsCgYBiF0Z8ytZGEyoX2WHF//We\nFerlR/NFHdK8jqklP1cy7NZIQv5bVUUjV2p03MNfR7XiaM9bLWpsEtOqfttFZz/2\nsLEPzYuwFlWK732pnI677bVuS/5FLN68bwmMd6q2csQwV79E/sbxPkHlPDWwldfa\n65ZRYrNuALCTRb8+2OVQPA==\n-----END PRIVATE KEY-----\n",
      clientEmail: "firebase-adminsdk-fbsvc@nextgenlearning-1.iam.gserviceaccount.com"
    };
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: "nextgenlearning-1"
    });
    
    console.log('✅ Firebase initialized successfully with hardcoded credentials');
    firebaseInitialized = true;
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase:', error);
}

// Send notification to web clients
export const sendNotificationToWeb = async (fcmTokens: string[], title: string, body: string, clickActionUrl: string = '/notification') => {
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

  try {
    console.log('Sending notification to', validTokens.length, 'devices');
    // Use sendEachForMulticast instead of sendMulticast
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Successfully sent message: ${response.successCount} success, ${response.failureCount} failure`);
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
