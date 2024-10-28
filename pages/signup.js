// pages/signup.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const validateFields = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill out all required fields.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!validateFields()) return;

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Response from backend:', result);

      if (response.ok) {
        setSuccessMessage('Signup successful! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(result.message || 'An error occurred during signup.');
      }
    } catch (error) {
      setError('Error during signup. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        
        <div class="mt-20">
        <h2 class="text-xl md:text-2xl text-center mt-24 md:mt-32 mb-0">Signup</h2>
            <div class="signupForm px-4 md:px-12 py-8 md:py-12">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="firstName">First Name</label>
                        <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter your first name"
                        className="border rounded-md px-3 py-2 w-full"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="lastName">Last Name</label>
                        <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter your last name"
                        className="border rounded-md px-3 py-2 w-full"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                        <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        className="border rounded-md px-3 py-2 w-full"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
                        <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        className="border rounded-md px-3 py-2 w-full"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">Sign Up</button>
                </form>
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
            </div>
        </div>
        <div className="text-center mt-4">
          <span className="text-sm">Already have an account? </span>
          <Link href="/login" className="text-blue-500">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
