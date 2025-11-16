import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GL } from '../../components/gl'

export default function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json().catch(() => null)
      
      if (!response.ok) {
        const errorMsg = data?.error || data?.message || `Failed to create account (${response.status})`
        throw new Error(errorMsg)
      }

      // User is created but NOT logged in yet - they need to verify email first
      // Don't store token or redirect to /app
      setMessage('Account created successfully! Please check your email to verify your account before logging in.')
      
      // Redirect to login page after showing success message
      setTimeout(() => navigate('/login'), 3000)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error creating account'
      setMessage(errorMsg)
      console.error('Signup error:', error)
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
            {/* <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 grid place-items-center shadow-md"> */}
              {/* <span className="text-white text-lg font-bold">P</span> */}
            {/* </div> */}
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
            <h2 className="text-2xl font-bold mb-6 text-white">Create account</h2>
            
            {message && (
              <div className={`mb-4 p-3 rounded-lg ${message.includes('success') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                {message}
              </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Username</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="User"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john.smith@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
            <p className="mt-4 text-sm text-gray-600 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline">Sign in</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
