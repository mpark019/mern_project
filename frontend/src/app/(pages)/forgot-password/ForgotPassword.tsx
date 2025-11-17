import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GL } from '../../../components/gl'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsSignedIn(!!token)
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json().catch(() => null)
      
      if (!response.ok) {
        const errorMsg = data?.error || data?.message || `Failed to send reset email (${response.status})`
        throw new Error(errorMsg)
      }

      setMessage('If an account with that email exists, a password reset link has been sent.')
      
      // Redirect to login page
      setTimeout(() => navigate('/login'), 3000)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error sending reset email'
      setMessage(errorMsg)
      console.error('Forgot password error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen text-gray-800">
      <GL className="fixed inset-0 -z-10" />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to={isSignedIn ? "/dashboard" : "/"} className="flex items-center gap-3">
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
            <h2 className="text-2xl font-bold mb-6 text-white">Forgot Password</h2>
            <p className="text-gray-300 mb-6 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            {message && (
              <div className={`mb-4 p-3 rounded-lg ${message.includes('sent') || message.includes('exists') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                {message}
              </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.smith@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p className="mt-4 text-sm text-gray-300 text-center">
              Remember your password?{' '}
              <Link to="/login" className="text-indigo-400 hover:underline">Sign in</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

