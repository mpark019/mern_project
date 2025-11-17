import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { GL } from '../../../components/gl';
import { SummaryBar } from './components/SummaryBar';
import { AddMealForm } from './components/AddMealForm';
import { EditMealForm } from './components/EditMealForm';
import { MealList } from './components/MealList';
import { ScanFoodButton } from './components/ScanFoodButton';
import { DatePicker } from './components/DatePicker';
import type { CalorieLog, CurrentUser, MealFormData, TodayTotals } from './types';
import { API_URL, getAuthHeaders, getLocalDateString } from './utils';


function Dashboard() {
  const navigate = useNavigate();
  const { date: urlDate } = useParams<{ date?: string }>();
  const [calorieLogs, setCalorieLogs] = useState<CalorieLog[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const today = getLocalDateString();
  
  const [formData, setFormData] = useState<MealFormData>({
    meal: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    date: urlDate || today,
  });
  const [editingLog, setEditingLog] = useState<CalorieLog | null>(null);
  const [editFormData, setEditFormData] = useState<MealFormData>({
    meal: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    date: urlDate || '',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const shouldAutoSubmitRef = useRef(false);

  // Update form date when URL date changes
  useEffect(() => {
    const dateToUse = urlDate || today;
    setFormData(prev => ({ ...prev, date: dateToUse }));
    setEditFormData(prev => ({ ...prev, date: urlDate || '' }));
  }, [urlDate, today]);

  // Auto submit when formData is populated from scan
  useEffect(() => {
    if (shouldAutoSubmitRef.current && formData.meal && formData.calories) {
      shouldAutoSubmitRef.current = false;
      createCalorieLog();
    }
  }, [formData]);

  // Check authentication and load current user
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Fetch current user from API to get latest data including calorieGoal
    (async () => {
      try {
        const response = await fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
          localStorage.setItem('user', JSON.stringify({
            _id: userData._id,
            username: userData.username,
            email: userData.email,
            calorieGoal: userData.calorieGoal,
          }));
        } else {
          // If unauthorized, redirect to login
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }
        }
      } catch (e) {
        console.error('Failed to fetch current user', e);
        if (userStr) {
          try {
            setCurrentUser(JSON.parse(userStr));
          } catch (parseError) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      }
    })();
  }, [navigate]);

  // Fetch all calorie logs
  const fetchCalorieLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const errorText = await response.text();
        setMessage('Error fetching calorie logs: ' + errorText);
        return;
      }
      const data = await response.json();
      setCalorieLogs(data.meals || []);
    } catch (error) {
      setMessage('Error fetching calorie logs: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Create a new calorie log
  const createCalorieLog = async () => {
    setLoading(true);
    try {
      const calories = parseFloat(formData.calories);
      const protein = parseFloat(formData.protein);
      const carbs = parseFloat(formData.carbs);
      const fats = parseFloat(formData.fats);

      if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fats)) {
        setMessage('Error: All numeric fields must be valid numbers');
        setLoading(false);
        return;
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
          date: formData.date || getLocalDateString(),
        }),
      });
      if (response.ok) {
        setMessage('Calorie log created successfully!');
        setFormData({
          meal: '',
          calories: '',
          protein: '',
          carbs: '',
          fats: '',
          date: getLocalDateString(),
        });
        setShowAddForm(false);
        fetchCalorieLogs();
      } else {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        setMessage('Error creating calorie log: ' + errorMessage);
      }
    } catch (error) {
      setMessage('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Delete a calorie log
  const deleteCalorieLog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setMessage('Calorie log deleted successfully!');
        fetchCalorieLogs();
      } else {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        setMessage('Error deleting calorie log: ' + errorMessage);
      }
    } catch (error) {
      setMessage('Error deleting calorie log: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Update a calorie log
  const updateCalorieLog = async () => {
    if (!editingLog) return;
    
    setLoading(true);
    try {
      const calories = parseFloat(editFormData.calories);
      const protein = parseFloat(editFormData.protein);
      const carbs = parseFloat(editFormData.carbs);
      const fats = parseFloat(editFormData.fats);

      if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fats)) {
        setMessage('Error: All numeric fields must be valid numbers');
        setLoading(false);
        return;
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
      });
      if (response.ok) {
        setMessage('Calorie log updated successfully!');
        setEditingLog(null);
        setEditFormData({ meal: '', calories: '', protein: '', carbs: '', fats: '', date: '' });
        fetchCalorieLogs();
      } else {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        setMessage('Error updating calorie log: ' + errorMessage);
      }
    } catch (error) {
      setMessage('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Start editing a calorie log
  const handleEdit = (log: CalorieLog) => {
    setEditingLog(log);
    setEditFormData({
      meal: log.meal,
      calories: log.calories.toString(),
      protein: log.protein.toString(),
      carbs: log.carbs.toString(),
      fats: log.fats.toString(),
      date: log.date,
    });
    setShowAddForm(false);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingLog(null);
    setEditFormData({ meal: '', calories: '', protein: '', carbs: '', fats: '', date: '' });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/');
  };

  // Load calorie logs on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && currentUser) {
      fetchCalorieLogs();
    }
  }, [currentUser]);

  // Determine the date to display
  const displayDate = urlDate || today;
  const displayLogs = calorieLogs.filter(log => log.date === displayDate);

  // Calculate totals for the display date
  const summaryTotals: TodayTotals = displayLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.protein,
      carbs: acc.carbs + log.carbs,
      fats: acc.fats + log.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  // Format date display helper
  const formatDateDisplay = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      const todayDate = new Date();
      const yesterday = new Date(todayDate);
      yesterday.setDate(yesterday.getDate() - 1);

      if (dateStr === getLocalDateString(todayDate)) {
        return "Today";
      } else if (dateStr === getLocalDateString(yesterday)) {
        return "Yesterday";
      } else {
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
    } catch {
      return dateStr;
    }
  };

  // Get user's calorie goal, default to 2000
  const goal = currentUser?.calorieGoal ?? 2000;

  return (
    <>
      <GL className="fixed inset-0 -z-10 blur" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <Link to="/dashboard" className="text-xl font-semibold text-white">YummyYummy</Link>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <Link to="/profile" className="text-white/80 hover:text-white">
              Profile
            </Link>
            <button onClick={logout} className="text-white hover:text-gray-400">
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.7),_black)]" />

      <div className="min-h-screen flex flex-col relative">
        {/* Message Display */}
        {message && (
          <div className="fixed top-20 left-0 w-full flex justify-center z-50 px-4">
            <div
              className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-200 ${
                message.includes('Error')
                  ? 'bg-red-500/90 text-white'
                  : 'bg-green-500/90 text-white'
              }`}
            >
              {message}
              <button
                className="ml-4 px-2 py-1 rounded bg-white/20 text-white text-xs hover:bg-white/30"
                onClick={() => setMessage('')}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <SummaryBar totals={summaryTotals} goal={goal} selectedDate={displayDate} />

        <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-4 pb-32">
          {/* Back to Today Button */}
          {urlDate && (
            <div className="mb-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="mb-3 text-white/80 hover:text-white flex items-center gap-2 transition-colors"
              >
                ← Back to Today
              </button>
              <h1 className="text-2xl md:text-3xl font-semibold text-white">
                {formatDateDisplay(displayDate)}
              </h1>
              <p className="text-sm text-gray-400 mt-1">{displayDate}</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg md:text-xl font-semibold text-white">
              Meals
            </h2>
            <div className="flex items-center gap-2">
              <DatePicker
                selectedDate={displayDate}
                onDateChange={(newDate) => {
                  if (newDate === today) {
                    navigate('/dashboard');
                  } else {
                    navigate(`/dashboard/day/${newDate}`);
                  }
                }}
                today={today}
                onClose={() => setShowAddForm(false)}
              />
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setEditingLog(null);
                }}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-semibold transition-colors"
              >
                {showAddForm ? 'Cancel' : 'Add Meal'}
              </button>
            </div>
          </div>

          {showAddForm && !editingLog && (
            <AddMealForm
              formData={formData}
              onFormDataChange={setFormData}
              onSubmit={createCalorieLog}
              loading={loading}
            />
          )}

          {editingLog && (
            <EditMealForm
              editFormData={editFormData}
              onFormDataChange={setEditFormData}
              onUpdate={updateCalorieLog}
              onCancel={handleCancelEdit}
              loading={loading}
            />
          )}

          <MealList
            meals={displayLogs}
            onEdit={handleEdit}
            onDelete={deleteCalorieLog}
            loading={loading}
            editingLog={editingLog}
            showDate={false}
          />
        </main>

        <ScanFoodButton
          onScanComplete={(data) => {
            const mealNames = data.foods.map(f => f.name).join(', ');
            shouldAutoSubmitRef.current = true;
            setFormData({
              meal: mealNames,
              calories: data.totalCalories.toString(),
              protein: data.totalProtein.toString(),
              carbs: data.totalCarbs.toString(),
              fats: data.totalFats.toString(),
              date: displayDate,
            });
            setMessage('Food scanned successfully! Added to your log.');
          }}
          onError={(error) => {
            setMessage('Error scanning food: ' + error);
          }}
        />
      </div>
    </>
  );
}

export default Dashboard;
