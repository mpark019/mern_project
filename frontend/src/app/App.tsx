import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


const API_URL = 'http://localhost:5050/calories'

interface CalorieLog {
  _id: string
  meal: string
  calories: number
  protein: number
  carbs: number
  fats: number
  date: string
  createdAt?: string
  updatedAt?: string
}

interface CurrentUser {
  _id: string
  username: string
  email: string
}

// Function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

function App() {
  const navigate = useNavigate()
  const [calorieLogs, setCalorieLogs] = useState<CalorieLog[]>([])
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({ meal: '', calories: '', protein: '', carbs: '', fats: '', date: '' })
  const [editingLog, setEditingLog] = useState<CalorieLog | null>(null)
  const [editFormData, setEditFormData] = useState({ meal: '', calories: '', protein: '', carbs: '', fats: '', date: '' })

  // Check authentication and load current user
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    // If no token, redirect to login
    if (!token) {
      navigate('/login')
      return
    }
    
    // Load user data if available
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr))
      } catch (e) {
        console.error('Failed to parse user from localStorage', e)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      }
    } else {
      navigate('/login')
    }
  }, [navigate])

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setCurrentUser(null)
    setMessage('Logged out successfully')
    setTimeout(() => navigate('/'), 1000)
  }

  // Fetch all calorie logs for the logged-in user
  const fetchCalorieLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) {
        const errorText = await response.text()
        setMessage('Error fetching calorie logs: ' + errorText)
        return
      }
      const data = await response.json()
      setCalorieLogs(data.meals || [])
      setMessage('Calorie logs fetched successfully!')
    } catch (error) {
      setMessage('Error fetching calorie logs: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  // Create a new calorie log
  const createCalorieLog = async () => {
    setLoading(true)
    try {
      const calories = parseFloat(formData.calories)
      const protein = parseFloat(formData.protein)
      const carbs = parseFloat(formData.carbs)
      const fats = parseFloat(formData.fats)

      if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fats)) {
        setMessage('Error: All numeric fields must be valid numbers')
        setLoading(false)
        return
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          meal: formData.meal,
          calories,
          protein,
          carbs,
          fats,
          date: formData.date || new Date().toISOString().split('T')[0], // Default to today if not provided
        }),
      })
      if (response.ok) {
        setMessage('Calorie log created successfully!')
        setFormData({ meal: '', calories: '', protein: '', carbs: '', fats: '', date: '' })
        fetchCalorieLogs() // Refresh the list
      } else {
        let errorMessage = 'Unknown error'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
        setMessage('Error creating calorie log: ' + errorMessage)
      }
    } catch (error) {
      setMessage('Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  // Delete a calorie log
  const deleteCalorieLog = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        setMessage('Calorie log deleted successfully!')
        fetchCalorieLogs() // Refresh the list
      } else {
        let errorMessage = 'Unknown error'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
        setMessage('Error deleting calorie log: ' + errorMessage)
      }
    } catch (error) {
      setMessage('Error deleting calorie log: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  // Update a calorie log
  const updateCalorieLog = async () => {
    if (!editingLog) return
    
    setLoading(true)
    try {
      // Validate numeric fields
      const calories = parseFloat(editFormData.calories)
      const protein = parseFloat(editFormData.protein)
      const carbs = parseFloat(editFormData.carbs)
      const fats = parseFloat(editFormData.fats)

      if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fats)) {
        setMessage('Error: All numeric fields must be valid numbers')
        setLoading(false)
        return
      }

      const response = await fetch(`${API_URL}/${editingLog._id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          meal: editFormData.meal,
          calories,
          protein,
          carbs,
          fats,
          date: editFormData.date,
        }),
      })
      if (response.ok) {
        setMessage('Calorie log updated successfully!')
        setEditingLog(null)
        setEditFormData({ meal: '', calories: '', protein: '', carbs: '', fats: '', date: '' })
        fetchCalorieLogs() // Refresh the list
      } else {
        let errorMessage = 'Unknown error'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
        setMessage('Error updating calorie log: ' + errorMessage)
      }
    } catch (error) {
      setMessage('Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  // Start editing a calorie log
  const startEditing = (log: CalorieLog) => {
    setEditingLog(log)
    setEditFormData({ 
      meal: log.meal, 
      calories: log.calories.toString(), 
      protein: log.protein.toString(), 
      carbs: log.carbs.toString(), 
      fats: log.fats.toString(), 
      date: log.date 
    })
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingLog(null)
    setEditFormData({ meal: '', calories: '', protein: '', carbs: '', fats: '', date: '' })
  }

  // Load calorie logs
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && currentUser) {
      fetchCalorieLogs()
    }
  }, [currentUser])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Calorie Logs
              </h1>
              <p className="text-sm text-gray-600 mt-1"></p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-sm text-gray-600">{loading ? 'Processing...' : 'Ready'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
            {currentUser && (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Logout
              </button>
            )}
          

        {/* Action Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
            {message && (
              <div className={`px-4 py-2 rounded-lg shadow-sm ${
                message.includes('Error') 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message}
              </div>
            )}
          </div>

          <button
            onClick={fetchCalorieLogs}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Calorie Logs
              </>
            )}
          </button>
        </div>

        {/* Edit Calorie Log Form (shown when editing) */}
        {editingLog && (
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 backdrop-blur-md rounded-2xl shadow-xl border border-purple-200 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Edit Calorie Log</h3>
                <p className="text-sm text-gray-500">Update calorie log information</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Meal Name</label>
                <input
                  type="text"
                  placeholder="Enter meal name"
                  value={editFormData.meal}
                  onChange={(e) => setEditFormData({...editFormData, meal: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                <input
                  type="number"
                  placeholder="Enter calories"
                  value={editFormData.calories}
                  onChange={(e) => setEditFormData({...editFormData, calories: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
                <input
                  type="number"
                  placeholder="Enter protein"
                  value={editFormData.protein}
                  onChange={(e) => setEditFormData({...editFormData, protein: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
                <input
                  type="number"
                  placeholder="Enter carbs"
                  value={editFormData.carbs}
                  onChange={(e) => setEditFormData({...editFormData, carbs: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fats (g)</label>
                <input
                  type="number"
                  placeholder="Enter fats"
                  value={editFormData.fats}
                  onChange={(e) => setEditFormData({...editFormData, fats: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={editFormData.date}
                  onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                />
              </div>
              <div className="col-span-2 flex gap-3">
                <button
                  onClick={updateCalorieLog}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✓ Update Log
                </button>
                <button
                  onClick={cancelEditing}
                  disabled={loading}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✖ Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Record Form */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Add Calorie Log</h3>
                <p className="text-sm text-gray-500">Track your meal nutrition</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meal Name</label>
                <input
                  type="text"
                  placeholder="e.g., Grilled Chicken Salad"
                  value={formData.meal}
                  onChange={(e) => setFormData({...formData, meal: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                  <input
                    type="number"
                    placeholder="kcal"
                    value={formData.calories}
                    onChange={(e) => setFormData({...formData, calories: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
                  <input
                    type="number"
                    placeholder="grams"
                    value={formData.protein}
                    onChange={(e) => setFormData({...formData, protein: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
                  <input
                    type="number"
                    placeholder="grams"
                    value={formData.carbs}
                    onChange={(e) => setFormData({...formData, carbs: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fats (g)</label>
                  <input
                    type="number"
                    placeholder="grams"
                    value={formData.fats}
                    onChange={(e) => setFormData({...formData, fats: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
              </div>
              <button
                onClick={createCalorieLog}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Calorie Log
              </button>
            </div>
          </div>

          {/* Display Calorie Logs */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">My Calorie Logs</h3>
                  <p className="text-sm text-gray-500">{calorieLogs.length} logs found</p>
                </div>
              </div>
            </div>

            {calorieLogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No calorie logs yet</p>
                <p className="text-sm text-gray-400 mt-1">Add your first meal log above</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {calorieLogs.map((log) => (
                  <div key={log._id} className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 mb-1">{log.meal}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <p><span className="font-semibold">Calories:</span> {log.calories} kcal</p>
                          <p><span className="font-semibold">Protein:</span> {log.protein}g</p>
                          <p><span className="font-semibold">Carbs:</span> {log.carbs}g</p>
                          <p><span className="font-semibold">Fats:</span> {log.fats}g</p>
                        </div>
                        <p className="text-xs text-indigo-600 font-medium mt-2">Date: {log.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(log)}
                          disabled={loading || editingLog !== null}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteCalorieLog(log._id)}
                          disabled={loading}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
