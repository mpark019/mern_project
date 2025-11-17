import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { GL } from '../../../components/gl'

type User = {
  _id: string
  username: string
  email: string
  calorieGoal?: number
}

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [goal, setGoal] = useState<number>(2000)
  const [savingGoal, setSavingGoal] = useState(false)
  const [goalMsg, setGoalMsg] = useState<string>('')

  const [pwdMsg, setPwdMsg] = useState<string>('')
  const [sendingReset, setSendingReset] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    ;(async () => {
      try {
        const res = await fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (res.ok) {
          setUser(data)
          if (typeof data.calorieGoal === 'number') setGoal(data.calorieGoal)
        } else {
          // If unauthorized, redirect to login
          if (res.status === 401) {
            navigate('/login')
          }
        }
      } catch (e) {
        console.error('Failed to fetch current user', e)
        navigate('/login')
      }
    })()
  }, [navigate])

  async function saveGoal() {
    if (!user) return
    const token = localStorage.getItem('token')
    if (!token) {
      setGoalMsg('You must be logged in')
      return
    }
    setSavingGoal(true)
    setGoalMsg('')
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ calorieGoal: goal }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || 'Failed to save goal')
      
      // Refresh to see new calorie goal
      const userRes = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (userRes.ok) {
        const userData = await userRes.json()
        setUser(userData)
        if (typeof userData.calorieGoal === 'number') setGoal(userData.calorieGoal)
      }
      
      setGoalMsg('Calorie goal saved')
    } catch (e) {
      setGoalMsg(e instanceof Error ? e.message : 'Error saving goal')
    } finally {
      setSavingGoal(false)
    }
  }

  async function requestPasswordReset() {
    if (!user || !user.email) {
      setPwdMsg('User email not found')
      return
    }
    setSendingReset(true)
    setPwdMsg('')
    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || data?.error || 'Failed to send reset email')
      setPwdMsg('If an account with that email exists, a password reset link has been sent to your email.')
    } catch (e) {
      setPwdMsg(e instanceof Error ? e.message : 'Error sending reset email')
    } finally {
      setSendingReset(false)
    }
  }

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
      };

  return (
    <div className="relative min-h-screen text-gray-800">
      <GL className="fixed inset-0 -z-10 blur" />
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <Link to="/dashboard" className="text-xl font-semibold text-white">YummyYummy</Link>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <Link to="/dashboard" className="text-white/80 hover:text-white">
              Dashboard
            </Link>
            <button onClick={logout} className="text-white hover:text-gray-400">
              Sign Out
            </button>
          </nav>
        </div>
      </header>
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.7),_black)]" />



      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-white mb-6">Profile</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Calorie Goal */}
          <section className="rounded-2xl bg-black/70 backdrop-blur p-6">
            <h3 className="text-white font-semibold mb-4">Daily Calorie Goal: {user?.calorieGoal ?? 2000}</h3>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm text-white/80 mb-2">Calories (kcal)</label>
                <input
                  type="number"
                  min={0}
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                />
              </div>
              <button
                onClick={saveGoal}
                disabled={savingGoal}
                className="px-5 py-3 rounded-xl bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold shadow disabled:opacity-60"
              >
                {savingGoal ? 'Saving...' : 'Save'}
              </button>
            </div>
            {goalMsg && (
              <p className={`mt-3 text-sm ${goalMsg.toLowerCase().includes('saved') ? 'text-green-200' : 'text-red-200'}`}>{goalMsg}</p>
            )}
          </section>

          {/* Change Password */}
          <section className="rounded-2xl bg-black/70 backdrop-blur p-6">
            <h3 className="text-white font-semibold mb-4 text-center">Change Password</h3>
            <div className="space-y-4">
              <p className="text-sm text-white/70 mb-4 text-center">
                To change your password, please click the button below.
              </p>
              <button
                onClick={requestPasswordReset}
                disabled={sendingReset}
                className="w-full px-5 py-3 rounded-xl bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold shadow disabled:opacity-60"
              >
                {sendingReset ? 'Sending...' : 'Send Password Reset Link'}
              </button>
              {pwdMsg && (
                <p className={`text-sm ${pwdMsg.includes('sent') || pwdMsg.includes('exists') ? 'text-green-200' : 'text-red-200'}`}>{pwdMsg}</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
