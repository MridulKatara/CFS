/* eslint-disable no-undef */
// Handle notification click first, similar to new-smart-lms
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Closing the notification when clicked
  const urlToOpen = event?.notification?.data?.url || '/notification';
  
  // Focus or open a window with the URL
  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
    }).then((clientList) => {
      // Try to find an existing window to focus
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window exists, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Import Firebase scripts - using version 8 like in new-smart-lms
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker
const firebaseConfig = {
  apiKey: "AIzaSyB-oIDH00Y1lXkyZKrwQhX7EtMbSnMdAq8",
  authDomain: "nextgenlearning-1.firebaseapp.com",
  projectId: "nextgenlearning-1",
  storageBucket: "nextgenlearning-1.appspot.com",
  messagingSenderId: "944446921182",
  appId: "1:944446921182:web:eba84f5b252cfe4178a54f"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Log service worker initialization
console.log('Firebase messaging service worker initialized');

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
    data: {
      url: payload?.data?.url || '/notification',
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle service worker installation
self.addEventListener('install', () => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', () => {
  console.log('Service Worker activating...');
  return self.clients.claim();
});
