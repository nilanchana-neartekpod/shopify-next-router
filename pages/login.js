// /pages/login.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State to handle errors
  const { login } = useAuth(); 
  const router = useRouter(); // Initialize router for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Clear any previous errors

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        console.log('Login successful:', result);

        if (!response.ok) throw new Error(result.message || 'Error during login');

        login(result);
        router.push('/'); 
        
    } catch (error) {
        setErrorMessage(error.message); // Show error message
        console.error('Login failed:', error);
    }
};

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src="/House.svg" alt="Logo" className="w-12 h-12 mb-4" />
          <h1 className="text-xl font-semibold">Sign In</h1>
        </div>

        {errorMessage && (
          <p className="text-red-500 mb-4">{errorMessage}</p>
        )}

        {showForgotPassword ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="border rounded-md px-3 py-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between mb-4">
              <Link href="#" onClick={() => setShowForgotPassword(false)} className="text-blue-500">
                Back to Login
              </Link>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Send Reset Link
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="border rounded-md px-3 py-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="border rounded-md px-3 py-2 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between mb-4">
              <Link href="#" onClick={() => setShowForgotPassword(true)} className="text-blue-500">
                Forgot your password?
              </Link>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Sign In
              </button>
            </div>
            <div className="text-center">
              <span className="text-sm">Don't have an account? </span>
              <Link href="/signup" className="text-blue-500">Create Account</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
