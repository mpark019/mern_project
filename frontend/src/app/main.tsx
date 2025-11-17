import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '../index.css'
import Landing from './(pages)/landing'
import Login from './(pages)/login'
import Signup from './(pages)/signup'
import Dashboard from './(pages)/dashboard'
import VerifyEmail from './(pages)/verify-email'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
