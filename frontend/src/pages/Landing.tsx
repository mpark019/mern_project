import { Link } from 'react-router-dom'
import { GL } from '../components/gl'

function Landing() {
  return (
  <>
  <GL className="fixed insert-0 -z-10" />
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-semibold text-white">MERN Project</h1>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <a className="text-white hover:text-gray-400" href="/signup">Sign Up</a>
            <a className="text-white hover:text-gray-400" href="/login">Login</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
                We will insert title here
              </h2>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/app"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-white font-semibold shadow-lg bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors"
                >
                  Open App
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
    </>
  )
}

export default Landing
