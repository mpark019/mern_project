import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '../index.css'
import Landing from './(pages)/landing'
import Login from './(pages)/login'
import Signup from './(pages)/signup'
import Dashboard from './(pages)/dashboard'
import Profile from './(pages)/profile'
import VerifyEmail from './(pages)/verify-email'
import ForgotPassword from './(pages)/forgot-password'
import ResetPassword from './(pages)/reset-password'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
