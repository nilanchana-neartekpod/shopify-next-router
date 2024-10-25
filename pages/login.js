// pages/login.js
import React, { useState } from 'react';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    // Reset errors
    setErrors({ email: '', password: '' });

    // Basic validation
    let valid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      valid = false;
    } else if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
      valid = false;
    }

    // Password validation
    if (!password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }));
      valid = false;
    } else if (password.length < 6) {
      setErrors((prev) => ({ ...prev, password: 'Password must be at least 6 characters long' }));
      valid = false;
    }

    if (valid) {
      // Add your login logic here
      console.log('Email:', email);
      console.log('Password:', password);
    }
  };
//   if (valid) {
//     // API call to login
//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         // Handle errors
//         const data = await response.json();
//         throw new Error(data.message || 'Login failed');
//       }

//       const data = await response.json();
//       console.log('Login successful:', data); // Handle successful login (e.g., save token, redirect, etc.)

//     } catch (error) {
//       setLoginError(error.message); // Display error message
//     }
//   }
// };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src="/House.svg" alt="Logo" className="w-12 h-12 mb-4" />
          <h1 className="text-xl font-semibold">Sign In</h1>
        </div>
        {showForgotPassword ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className={`border rounded-md px-3 py-2 w-full ${errors.email ? 'border-red-500' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="flex justify-between mb-4">
              <Link href="#" onClick={() => setShowForgotPassword(false)} className="text-blue-500">
                Back to Login
              </Link>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Send Reset Link</button>
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
                className={`border rounded-md px-3 py-2 w-full ${errors.email ? 'border-red-500' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className={`border rounded-md px-3 py-2 w-full ${errors.password ? 'border-red-500' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div className="flex justify-between mb-4">
              <Link href="#" onClick={() => setShowForgotPassword(true)} className="text-blue-500">Forgot your password?</Link>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Sign In</button>
            </div>
            <div className="text-center">
              <span className="text-sm">Don't have an account? </span>
              <Link href="/create-account" className="text-blue-500">Create Account</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
