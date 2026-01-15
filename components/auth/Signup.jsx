import { useState } from 'react';
import { useAuth } from '../../App';
import { Link, useNavigate } from 'react-router-dom';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    signup(email, password, name);
    navigate('/dashboard');
  };

  const passwordRules = [
    'At least 8 characters long',
    'Contains at least one uppercase letter',
    'Contains at least one lowercase letter',
    'Contains at least one number',
    'Contains at least one special character (!@#$%^&*)',
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-neutral-300 p-8">
          <div className="mb-8">
            <div className="w-12 h-12 bg-neutral-300 mb-4"></div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Sign Up</h1>
            <p className="text-neutral-600">Create a new account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none"
                placeholder="John Doe"
                required
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-300">
              <p className="text-xs font-medium text-neutral-700 mb-2">Password Requirements:</p>
              <ul className="space-y-1">
                {passwordRules.map((rule, index) => (
                  <li key={index} className="text-xs text-neutral-600 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-neutral-900 text-white font-medium hover:bg-neutral-700 transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 pt-6 border-t-2 border-neutral-200">
            <p className="text-center text-sm text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="text-neutral-900 underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
