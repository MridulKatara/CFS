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
import PrivateRoute from './common/PrivateRoute'
import { getUserRole, isAuthenticated } from './common/auth'
import { requestNotificationPermission, onForegroundMessage } from './services/firebase'
import Snackbar from './components/Snackbar'

function App() {
  const location = useLocation()
  const role = getUserRole()
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    // Request notification permission when user is authenticated
    if (isAuthenticated()) {
      requestNotificationPermission()
        .then(token => {
          if (token) {
            console.log('Notification permission granted');
          }
        });
      
      // Handle foreground messages
      const unsubscribe = onForegroundMessage((payload) => {
        console.log('Received foreground message:', payload);
        setSnackbar({
          message: payload.notification.title + ': ' + payload.notification.body,
          type: 'info'
        });
      });
      
      return () => {
        unsubscribe && unsubscribe();
      };
    }
  }, []);

  // Redirect logic after login
  if (isAuthenticated() && (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/reset-password')) {
    if (role === 'admin') return <Navigate to="/admin/dashboard" />
    if (role === 'student') return <Navigate to="/home" />
    // Add more roles as needed
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
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
          {/* Add more admin routes here */}
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
