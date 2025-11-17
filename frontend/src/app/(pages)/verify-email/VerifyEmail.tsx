import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GL } from "../../../components/gl";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-verified'>('loading');
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/users/verify/${token}`);
        const data = await response.json().catch(() => null);
        
        if (response.ok) {
          if (data?.message?.includes("already verified")) {
            setStatus('already-verified');
            setMessage("Email Verified");
          } else {
            setStatus('success');
            setMessage("Email Verified Successfully!");
          }
        } else {
          setStatus('error');
          const errorMsg = data?.error || data?.message || `Verification failed (${response.status})`;
          setMessage(errorMsg);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus('error');
        setMessage("Verification Failed - Server Error");
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email.');
    }
  }, [token]);

  return (
    <div className="relative min-h-screen text-gray-800">
      <GL className="fixed inset-0 -z-10" />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            {/* <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 grid place-items-center shadow-md">
              <span className="text-white text-lg font-bold">P</span>
            </div> */}
            <h1 className="text-xl font-semibold text-white">YummyYummy</h1>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link className="text-white hover:text-gray-400" to="/login">Login</Link>
            <Link className="text-white hover:text-gray-400" to="/signup">Sign up</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        <section className="py-16 md:py-24">
          <div className="max-w-md mx-auto backdrop-blur rounded-2xl shadow-xl border border-white/20 p-8">
            {/* Loading State */}
            {status === 'loading' && (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <svg className="animate-spin h-12 w-12 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{message}</h2>
                <p className="text-gray-300">Please wait while we verify your account...</p>
              </div>
            )}

            {/* Success State */}
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
                <p className="text-gray-300 mb-6">Your account has been verified. You can now log in.</p>
                <Link
                  to="/login"
                  className="inline-block w-full bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all"
                >
                  Go to Login
                </Link>
              </div>
            )}

            {/* Already Verified State */}
            {status === 'already-verified' && (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{message}</h2>
                <p className="text-gray-300 mb-6">This account is verified. Please proceed to login.</p>
                <Link
                  to="/login"
                  className="inline-block w-full bg-linear-to-r bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all"
                >
                  Go to Login
                </Link>
              </div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{message}</h2>
                <p className="text-gray-300 mb-6">The verification link may be invalid or expired.</p>
                <div className="space-y-3">
                  <Link
                    to="/signup"
                    className="block w-full bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all"
                  >
                    Sign Up Again
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
  );
}