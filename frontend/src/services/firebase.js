import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB-oIDH00Y1lXkyZKrwQhX7EtMbSnMdAq8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nextgenlearning-1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nextgenlearning-1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nextgenlearning-1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "944446921182",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:944446921182:web:eba84f5b252cfe4178a54f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Function to request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    console.log('Requesting notification permission...');
    
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return null;
    }

    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    
    if (permission === 'granted') {
      // Get FCM token
      console.log('Getting FCM token...');
      const currentToken = await getToken(messaging);
      
      if (currentToken) {
        console.log('FCM token obtained:', currentToken.substring(0, 20) + '...');
        // Send the token to your server
        await sendTokenToServer(currentToken);
        return currentToken;
      } else {
        console.log('No registration token available. Request permission to generate one.');
        return null;
      }
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

// Function to send token to your backend
const sendTokenToServer = async (token) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const authToken = localStorage.getItem('token');
  
  if (!user) {
    console.log('No user found, cannot send token to server');
    return;
  }
  
  if (!authToken) {
    console.log('No auth token found, cannot send token to server');
    return;
  }
  
  try {
    console.log('Sending FCM token to server for user:', user.fullName || user.personalEmail);
    const response = await fetch('https://cfs-djzu.onrender.com/notifications/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ token })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('FCM token sent to server successfully:', result);
    } else {
      const error = await response.text();
      console.error('Failed to send FCM token to server:', response.status, error);
    }
  } catch (error) {
    console.error('Error sending FCM token to server:', error);
  }
};

// Handle foreground messages
export const onForegroundMessage = (callback) => {
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};

export default messaging;
