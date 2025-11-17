import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GL } from '../../../components/gl'

function Landing() {
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsSignedIn(!!token)
  }, [])

  return (
    <>
      <GL className="fixed inset-0 -z-10" />
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link to={isSignedIn ? "/dashboard" : "/"} className="text-xl font-semibold text-white">YummyYummy</Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link to="/login" className="text-white/80 hover:text-white transition-colors">
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 flex-1">
          {/* Hero Section */}
          <section className="py-20 md:py-32">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white mb-6">
                Track Wisely
                <span className="block text-orange-400">Start Burning</span>
              </h1>
              <p className="text-xl text-white/80 mb-10 leading-relaxed">
                Monitor your daily nutrition, track macros, and reach your health goals with our simple calorie tracking app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/signup"
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-lg shadow-lg transition-all"
                >
                  Start Tracking
                </Link>
                <Link 
                  to="/login"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-lg border-2 border-white/20 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 md:py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Everything You Need to Track Nutrition
              </h2>
              <p className="text-lg text-white/70">
                Simple tools to help you stay on track with your health goals
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 - Calorie Tracking */}
              <div className="rounded-2xl bg-black/50 backdrop-blur p-6 border border-white/10">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-white mb-2">Daily Calorie Tracking</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Log your meals throughout the day and see your calorie intake in real-time. Set personalized daily goals.
                </p>
              </div>

              {/* Feature 2 - Macro Tracking */}
              <div className="rounded-2xl bg-black/50 backdrop-blur p-6 border border-white/10">
                <div className="text-4xl mb-4">🥗</div>
                <h3 className="text-xl font-semibold text-white mb-2">Macro Nutrients</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Track protein, carbs, and fats to ensure you're getting the right balance of nutrients for your goals.
                </p>
              </div>

              {/* Feature 3 - Food Scanning */}
              <div className="rounded-2xl bg-black/50 backdrop-blur p-6 border border-white/10">
                <div className="text-4xl mb-4">📷</div>
                <h3 className="text-xl font-semibold text-white mb-2">Food Scanning</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Use your camera to scan food items and automatically log calories and macros. Fast and convenient.
                </p>
              </div>
            </div>
          </section>

          {/* Stats/Preview Section */}
          <section className="py-16 md:py-24">
            <div className="rounded-2xl bg-black/40 backdrop-blur p-8 md:p-12 border border-white/10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    See Your Progress at a Glance
                  </h2>
                  <p className="text-white/80 mb-6 leading-relaxed">
                    Get a clear view of your daily nutrition with our intuitive dashboard. Track calories, macros, and see how close you are to your goals.
                  </p>
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-center gap-2">
                      <span className="text-orange-400">✓</span>
                      Real-time calorie counting
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-orange-400">✓</span>
                      Macro breakdown (protein, carbs, fats)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-orange-400">✓</span>
                      Personalized daily goals
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-orange-400">✓</span>
                      Easy meal logging
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl bg-white/5 p-6 border border-white/10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Calories</span>
                      <span className="text-white font-semibold">1,250 / 2,000</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: '62.5%' }}></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <div className="text-white/70 text-xs mb-1">Protein</div>
                        <div className="text-white font-semibold">85g</div>
                      </div>
                      <div>
                        <div className="text-white/70 text-xs mb-1">Carbs</div>
                        <div className="text-white font-semibold">150g</div>
                      </div>
                      <div>
                        <div className="text-white/70 text-xs mb-1">Fats</div>
                        <div className="text-white font-semibold">45g</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-white/60 text-sm">
              © 2025 YummyYummy
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Landing
