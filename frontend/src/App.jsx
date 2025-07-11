import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './common/login/login'
import Register from './common/register/Register'
import ResetPassword from './common/resetPassword/ResetPassword'
import LandingPage from './common/LandingPage/LandingPage'
import Notification from './student/Notification/Notification'
import NotificationDetail from './student/Notification/NotificationDetail'
import MyProgram from './student/MyPrograms'
import Profile from './common/profile/Profile'
import EditProfile from './common/profile/EditProfile'
import Payment from './student/Payment'
import ProgramDetailsActive from './student/ProgramDetailsActive'
import ProgramDetailsInactives from './student/ProgramDetailsInactives'
import Dashboard from './admin/Dashboard'
import Universities from './admin/Universities'
import Programs from './admin/Programs'
import ProgramForm from './admin/ProgramForm'
import NotificationManager from './admin/NotificationManager'
import AdminProfile from './admin/Profile'
import PrivateRoute from './common/PrivateRoute'
import { getUserRole, isAuthenticated } from './common/auth'
import { requestNotificationPermission, onForegroundMessage } from './services/firebase'
import Snackbar from './components/Snackbar'

function App() {
  const location = useLocation()
  const role = getUserRole()
  const [snackbar, setSnackbar] = useState(null);

  // Initialize Firebase notifications when the app loads - always get a fresh token
  useEffect(() => {
    const initializeFirebase = async () => {
      if (isAuthenticated()) {
        console.log('Initializing Firebase notifications...');
        try {
          // Request notification permission and get a fresh token each time
          const token = await requestNotificationPermission(true);
          if (token) {
            console.log('Firebase notification token obtained and sent to server');
          } else {
            console.log('Failed to get notification token');
          }
        } catch (error) {
          console.error('Error initializing Firebase notifications:', error);
        }
      }
    };

    initializeFirebase();
  }, []);

  // Handle foreground messages
  useEffect(() => {
    if (isAuthenticated()) {
      const unsubscribe = onForegroundMessage((payload) => {
        console.log('Received foreground message:', payload);
        // Display notification in UI
        if (payload.notification) {
          setSnackbar({
            message: `${payload.notification.title}: ${payload.notification.body}`,
            type: 'info'
          });
        }
      });
      
      return () => {
        unsubscribe && unsubscribe();
      };
    }
  }, []);

  // Register service worker for background notifications
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('../public/firebase-messaging-sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  // Redirect logic after login
  if (isAuthenticated() && (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/reset-password')) {
    if (role === 'admin') return <Navigate to="/admin/dashboard" />
    if (role === 'student') return <Navigate to="/home" />
    // Add more roles as needed
  }

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Student routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<LandingPage />} />
          <Route path="/my-program" element={<MyProgram />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/notification/:id" element={<NotificationDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/program-details-active/:programId" element={<ProgramDetailsActive />} />
          <Route path="/program-details-inactives/:programId" element={<ProgramDetailsInactives />} />
        </Route>

        {/* Admin routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/programs" element={<Programs />} />
          <Route path="/admin/programs/new" element={<ProgramForm />} />
          <Route path="/admin/programs/edit/:id" element={<ProgramForm />} />
          <Route path="/admin/universities" element={<Universities />} />
          <Route path="/admin/notifications" element={<NotificationManager />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

        {/* Default route */}
        <Route path="*" element={<Navigate to={isAuthenticated() ? (role === 'admin' ? "/admin/dashboard" : "/home") : "/login"} />} />
      </Routes>
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </>
  )
}

export default App 
