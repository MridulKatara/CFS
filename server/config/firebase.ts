import admin from 'firebase-admin';
import path from 'path';

// Initialize Firebase Admin with service account
// Note: In production, use environment variables for this
const serviceAccount = require('../service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const messaging = admin.messaging();

export default admin;
