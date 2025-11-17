import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GL } from '../../../components/gl'

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
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
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json().catch(() => null)
      
      if (!response.ok) {
        const errorMsg = data?.error || data?.message || `Login failed (${response.status})`
        throw new Error(errorMsg)
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify({
          _id: data._id,
          username: data.username,
          email: data.email
        }))
      }

      setMessage('Login successful!')
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error logging in'
      setMessage(errorMsg)
      console.error('Login error:', error)
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
            {/* <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 grid place-items-center shadow-md">
              <span className="text-white text-lg font-bold">P</span>
            </div> */}
            <h1 className="text-xl font-semibold text-white">YummyYummy</h1>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link className="text-white hover:text-gray-400" to="/signup">Sign up</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        <section className="py-16 md:py-24">
          <div className="max-w-md mx-auto backdrop-blur rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold mb-6 text-white">Login</h2>
            
            {message && (
              <div className={`mb-4 p-3 rounded-lg ${message.includes('success') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                {message}
              </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit}>
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
                className="w-full bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Continue'}
              </button>
            </form>
            <p className="mt-4 text-sm text-gray-600 text-center">
              New here?{' '}
              <Link to="/signup" className="text-indigo-600 hover:underline">Create an account</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
