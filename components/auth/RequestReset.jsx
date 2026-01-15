import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function RequestReset() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Mock: In real app, send reset email
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-neutral-300 p-8">
          <div className="mb-8">
            <div className="w-12 h-12 bg-neutral-300 mb-4"></div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Reset Password</h1>
            <p className="text-neutral-600">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 text-white font-medium hover:bg-neutral-700 transition-colors"
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="p-6 bg-neutral-100 border border-neutral-300">
              <div className="w-12 h-12 bg-neutral-300 mx-auto mb-4"></div>
              <p className="text-center text-neutral-700 mb-2 font-medium">
                Check your email
              </p>
              <p className="text-center text-sm text-neutral-600">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t-2 border-neutral-200">
            <p className="text-center text-sm text-neutral-600">
              Remember your password?{' '}
              <Link to="/login" className="text-neutral-900 underline font-medium">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
