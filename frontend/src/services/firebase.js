import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';
import apiService from './api';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB-oIDH00Y1lXkyZKrwQhX7EtMbSnMdAq8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nextgenlearning-1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nextgenlearning-1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nextgenlearning-1.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "944446921182",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:944446921182:web:eba84f5b252cfe4178a54f"
};

// Initialize Firebase
let app;
let messaging;

try {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
  console.log('Firebase messaging initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Store the token in localStorage for reference
const FCM_TOKEN_KEY = 'fcm_token';

// Function to request notification permission and get FCM token
export const requestNotificationPermission = async (forceRefresh = true) => {
  try {
    console.log('Requesting notification permission...');
    
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return null;
    }

    // Always delete the old token first if forcing refresh
    if (forceRefresh) {
      const oldToken = localStorage.getItem(FCM_TOKEN_KEY);
      if (oldToken && messaging) {
        try {
          await deleteToken(messaging);
          console.log('Previous token deleted');
          localStorage.removeItem(FCM_TOKEN_KEY);
        } catch (deleteError) {
          console.warn('Error deleting previous token:', deleteError);
        }
      }
    }

    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    
    if (permission === 'granted') {
      // Get FCM token - similar to new-smart-lms implementation
      console.log('Getting FCM token...');
      try {
        const currentToken = await getToken(messaging);
        
        if (currentToken) {
          console.log('FCM token obtained:', currentToken.substring(0, 20) + '...');
          
          // Store token in localStorage
          localStorage.setItem(FCM_TOKEN_KEY, currentToken);
          
          // Send the token to your server
          await sendTokenToServer(currentToken);
          return currentToken;
        } else {
          console.log('No registration token available. Request permission to generate one.');
          return null;
        }
      } catch (tokenError) {
        console.error('Error getting token:', tokenError);
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
    
    // Use the API service to save the token
    const result = await apiService.saveNotificationToken(token);
    console.log('FCM token sent to server result:', result);
    
    return result;
  } catch (error) {
    console.error('Error sending FCM token to server:', error);
    throw error;
  }
};

// Handle foreground messages
export const onForegroundMessage = (callback) => {
  if (!messaging) {
    console.error('Firebase messaging not initialized');
    return () => {};
  }
  
  return onMessage(messaging, (payload) => {
    console.log('Received foreground message:', payload);
    
    // Create a notification directly similar to new-smart-lms implementation
    if (payload.notification && payload.notification.title && payload.notification.body) {
      try {
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
          body: payload.notification.body,
          icon: '/icon-192x192.png',
          data: {
            url: payload?.data?.url || '/notification',
          },
        };
        
        // Display notification and then call the callback
        const notification = new Notification(notificationTitle, notificationOptions);
        notification.onclick = event => {
          event.preventDefault();
          const urlToOpen = notificationOptions.data.url;
          window.location.href = urlToOpen;
        };
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }
    
    callback(payload);
  });
};

export default messaging;
