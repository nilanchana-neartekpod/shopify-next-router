// /pages/login.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [forgotPassword,setForgotPassword]=useState("")
  const { login } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let tempErrors = { email: '', password: '' };

    if (!email) {
      tempErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(email)) {
      tempErrors.email = 'Invalid email format';
      valid = false;
    }

    if (!password) {
      tempErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    if (!validateForm()) return;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const userData = await response.json();

    if (!response.ok) throw new Error(userData.message || 'Error during login is invalid');

    login(userData); 
    router.push('/customer');
  } catch (error) {
    setErrorMessage(error.message);
  }
  };


  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setErrorMessage('');
  
    try {
      const response = await fetch('/api/forgotpw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
  setForgotPassword(result)
  setEmail(" ")
      if (!response.ok) throw new Error(result.message || 'Error during password recovery');
  
      // Optionally, show a success message or redirect
      setSuccessMessage('If an account exists with that email, we have sent instructions to reset your password.');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src="/House.svg" alt="Logo" className="w-12 h-12 mb-4" />
          <h1 className="text-xl font-semibold">Sign In</h1>
        </div>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
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
              {/* <Link
  href="/login#"
  onClick={handleForgotPassword}
  className="bg-blue-500 text-white px-4 py-2 rounded-md inline-block"
>
  Send Reset Link
</Link> */}
            </div>
            {forgotPassword && <p className='text-green-500 mb-4'>{forgotPassword?.result?.message}</p>}
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                className={`border rounded-md px-3 py-2 w-full ${errors.email ? 'border-red-500' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                className={`border rounded-md px-3 py-2 w-full ${errors.password ? 'border-red-500' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div className="flex justify-between mb-4">
              <Link href="#" onClick={() => setShowForgotPassword(true)} className="text-blue-500">
                Forgot your password?
              </Link>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Sign In</button>
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
