import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your Firebase configuration - replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Function to request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Get FCM token
      const currentToken = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY'
      });
      
      if (currentToken) {
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
  if (!user) return;
  
  try {
    await fetch('http://localhost:7001/user/notification-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ token })
    });
    console.log('FCM token sent to server');
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
