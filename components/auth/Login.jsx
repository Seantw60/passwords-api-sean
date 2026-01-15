import { useState } from 'react';
import { useAuth } from '../../App';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-neutral-300 p-8">
          <div className="mb-8">
            <div className="w-12 h-12 bg-neutral-300 mb-4"></div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Login</h1>
            <p className="text-neutral-600">Enter your credentials to access your account</p>
          </div>

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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 w-4 h-4" />
                <span className="text-sm text-neutral-600">Remember me</span>
              </label>
              <Link to="/request-reset" className="text-sm text-neutral-700 underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-neutral-900 text-white font-medium hover:bg-neutral-700 transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6 pt-6 border-t-2 border-neutral-200">
            <p className="text-center text-sm text-neutral-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-neutral-900 underline font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-neutral-100 border border-neutral-300">
            <p className="text-xs text-neutral-600 mb-2 font-medium">Demo Credentials:</p>
            <p className="text-xs text-neutral-600">Admin: admin@example.com</p>
            <p className="text-xs text-neutral-600">Editor: editor@example.com</p>
            <p className="text-xs text-neutral-600">Reader: reader@example.com</p>
            <p className="text-xs text-neutral-600 mt-2">Password: any</p>
          </div>
        </div>
      </div>
    </div>
  );
}
