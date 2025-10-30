import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { GL } from '../components/gl'
import { useState } from 'react'




export default function Signup() {
    
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    // TODO: Hook up to backend auth
  }
  
  

  

  return (
    <div className="relative min-h-screen text-gray-800">
      <GL className="fixed inset-0 -z-10" />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 grid place-items-center shadow-md">
              <span className="text-white text-lg font-bold">MP</span>
            </div>
            <h1 className="text-xl font-semibold text-white">MERN Starter</h1>
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
            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Username</label>
                <input
                  type="text"
                  required
                  placeholder="User"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Email</label>
                <input
                  type="email"
                  required
                  placeholder="john.smith@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all"
              >
                Create Account
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
