import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GL } from '../../../components/gl'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>()
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid reset link. Please request a new password reset.')
    }
  }, [token])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/users/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: formData.password }),
      })

      const data = await response.json().catch(() => null)
      
      if (!response.ok) {
        const errorMsg = data?.error || data?.message || `Failed to reset password (${response.status})`
        throw new Error(errorMsg)
      }

      setStatus('success')
      setMessage('Password has been reset successfully!')
      
      // Redirect to login page
      setTimeout(() => navigate('/login'), 2000)
    } catch (error) {
      setStatus('error')
      const errorMsg = error instanceof Error ? error.message : 'Error resetting password'
      setMessage(errorMsg)
      console.error('Reset password error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen text-gray-800">
      <GL className="fixed inset-0 -z-10" />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white">YummyYummy</h1>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link className="text-white hover:text-gray-400" to="/login">Sign in</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        <section className="py-16 md:py-24">
          <div className="max-w-md mx-auto backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
            {status === 'form' && (
              <>
                <h2 className="text-2xl font-bold mb-6 text-white">Reset Password</h2>
                <p className="text-gray-300 mb-6 text-sm">
                  Enter your new password below.
                </p>
                
                {message && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-200">
                    {message}
                  </div>
                )}

                <form className="space-y-4" onSubmit={onSubmit}>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">New Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      minLength={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="••••••••"
                      minLength={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              </>
            )}

            {status === 'success' && (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{message}</h2>
                <p className="text-gray-300 mb-6">Redirecting to login page...</p>
                <Link
                  to="/login"
                  className="inline-block w-full bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all"
                >
                  Go to Login
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Reset Failed</h2>
                <p className="text-gray-300 mb-6">{message}</p>
                <div className="space-y-3">
                  <Link
                    to="/forgot-password"
                    className="block w-full bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all"
                  >
                    Request New Reset Link
                  </Link>
                  <Link
                    to="/login"
                    className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all"
                  >
                    Go to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

