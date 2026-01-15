import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Mock: In real app, update password
    navigate('/login');
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
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Set New Password</h1>
            <p className="text-neutral-600">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                New Password
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
                Confirm New Password
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
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
