import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Login from './common/login/login'
// import Register from './common/register/Register'
// import Profile from './common/profile/Profile'
// import EditProfile from './common/profile/EditProfile'
// import LandingPage from './common/LandingPage/LandingPage'
import Notification from './student/Notification/Notification'
import NotificationDetail from './student/Notification/NotificationDetail'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Notification />} />
        <Route path="/notification/:id" element={<NotificationDetail />} />
      </Routes>
    </Router>
  )
}

export default App
