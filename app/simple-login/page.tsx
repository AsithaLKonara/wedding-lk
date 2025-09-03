'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const credentials = [
  // Admins
  { email: 'admin1@wedding.lk', password: 'admin123', name: 'Admin 1', role: 'admin', description: 'Full system access' },
  { email: 'admin2@wedding.lk', password: 'admin123', name: 'Admin 2', role: 'admin', description: 'Full system access' },
  { email: 'admin3@wedding.lk', password: 'admin123', name: 'Admin 3', role: 'admin', description: 'Full system access' },
  
  // Users (Wedding Couples)
  { email: 'user1@example.com', password: 'user123', name: 'User 1', role: 'user', description: 'Wedding couple - can book services' },
  { email: 'user2@example.com', password: 'user123', name: 'User 2', role: 'user', description: 'Wedding couple - can book services' },
  { email: 'user3@example.com', password: 'user123', name: 'User 3', role: 'user', description: 'Wedding couple - can book services' },
  
  // Vendors
  { email: 'vendor1@example.com', password: 'vendor123', name: 'Vendor 1', role: 'vendor', description: 'Service provider - manage bookings' },
  { email: 'vendor2@example.com', password: 'vendor123', name: 'Vendor 2', role: 'vendor', description: 'Service provider - manage bookings' },
  { email: 'vendor3@example.com', password: 'vendor123', name: 'Vendor 3', role: 'vendor', description: 'Service provider - manage bookings' },
  
  // Wedding Planners
  { email: 'planner1@example.com', password: 'planner123', name: 'Planner 1', role: 'wedding_planner', description: 'Wedding planner - manage events' },
  { email: 'planner2@example.com', password: 'planner123', name: 'Planner 2', role: 'wedding_planner', description: 'Wedding planner - manage events' },
  { email: 'planner3@example.com', password: 'planner123', name: 'Planner 3', role: 'wedding_planner', description: 'Wedding planner - manage events' },
];

export default function SimpleLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(credentials[0]);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/simple-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect based on role
        switch (data.user.role) {
          case 'admin':
            router.push('/dashboard/admin');
            break;
          case 'vendor':
            router.push('/dashboard/vendor');
            break;
          case 'wedding_planner':
            router.push('/dashboard/planner');
            break;
          case 'user':
          default:
            router.push('/dashboard/user');
            break;
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (user: typeof credentials[0]) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/simple-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, password: user.password }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect based on role
        switch (data.user.role) {
          case 'admin':
            router.push('/dashboard/admin');
            break;
          case 'vendor':
            router.push('/dashboard/vendor');
            break;
          case 'wedding_planner':
            router.push('/dashboard/planner');
            break;
          case 'user':
          default:
            router.push('/dashboard/user');
            break;
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🔐 Simple Login
          </h1>
          <p className="text-lg text-gray-600">
            Bypass NextAuth issues - Direct authentication
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Manual Login Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Manual Login
            </h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>

          {/* Quick Login Options */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Quick Login
            </h2>
            
            <div className="space-y-3">
              {credentials.map((user, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {user.email} / {user.password}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'vendor' ? 'bg-green-100 text-green-800' :
                        user.role === 'wedding_planner' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                      <button
                        onClick={() => quickLogin(user)}
                        disabled={isLoading}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            This bypasses NextAuth completely and uses simple cookie-based authentication
          </p>
        </div>
      </div>
    </div>
  );
}
