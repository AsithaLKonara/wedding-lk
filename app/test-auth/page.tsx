"use client"

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

function TestAuthPage() {
  const { data: session, status } = useSession() || { data: null, status: 'loading' };
  const [email, setEmail] = useState('fixed@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState<any>(null);

  const handleSignIn = async () => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      setResult(result);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setResult(null);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleSignIn}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In
          </button>
          
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
        
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Session Status:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify({ status, session }, null, 2)}
          </pre>
        </div>
        
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Last Result:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(TestAuthPage), { ssr: false });
