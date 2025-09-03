'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
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

export default function TestCredentialsPage() {
  const [selectedUser, setSelectedUser] = useState(credentials[0]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: selectedUser.email,
        password: selectedUser.password,
        redirect: false,
      });

      if (result?.ok) {
        // Redirect based on role
        switch (selectedUser.role) {
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
        alert('Login failed: ' + result?.error);
      }
    } catch (error) {
      alert('Login error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCredentials = (user: typeof credentials[0]) => {
    navigator.clipboard.writeText(`${user.email} / ${user.password}`);
    alert('Credentials copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🔐 Test Credentials
          </h1>
          <p className="text-lg text-gray-600">
            Use these credentials to test different user roles and access levels
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Credentials List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Available Test Accounts
            </h2>
            <div className="space-y-3">
              {credentials.map((user, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedUser.email === user.email
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedUser(user)}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          copyCredentials(user);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Login Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Quick Login
            </h2>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Selected Account:</h3>
              <p className="text-sm text-gray-600">
                <strong>Name:</strong> {selectedUser.name}<br/>
                <strong>Email:</strong> {selectedUser.email}<br/>
                <strong>Password:</strong> {selectedUser.password}<br/>
                <strong>Role:</strong> {selectedUser.role}<br/>
                <strong>Description:</strong> {selectedUser.description}
              </p>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Logging in...' : `Login as ${selectedUser.name}`}
            </button>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">📝 Note:</h4>
              <p className="text-sm text-yellow-700">
                These are test credentials for development. In production, use proper authentication with database users.
              </p>
            </div>
          </div>
        </div>

        {/* Role Information */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Role-Based Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">👑 Admin</h3>
              <p className="text-sm text-red-700">
                Full system access, user management, analytics, platform settings
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">👥 User</h3>
              <p className="text-sm text-blue-700">
                Wedding couples, can browse and book services, manage bookings
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🏢 Vendor</h3>
              <p className="text-sm text-green-700">
                Service providers, manage services, bookings, and client interactions
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">🎯 Planner</h3>
              <p className="text-sm text-purple-700">
                Wedding planners, manage events, coordinate vendors and clients
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
