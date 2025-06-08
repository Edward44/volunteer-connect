'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    userType: 'volunteer'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    setIsSubmitting(true);

    try {
      let user = null;
      
      if (formData.userType === 'volunteer') {
        // Look for volunteer
        const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
        user = volunteers.find(vol => vol.email.toLowerCase() === formData.email.toLowerCase());
      } else {
        // Look for organization
        const organizations = JSON.parse(localStorage.getItem('organizations') || '[]');
        user = organizations.find(org => org.email.toLowerCase() === formData.email.toLowerCase());
      }

      if (user) {
        // Login successful
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect based on user type
        if (user.userType === 'volunteer') {
          router.push('/dashboard/volunteer');
        } else {
          router.push('/dashboard/organization');
        }
      } else {
        setError(`No ${formData.userType} account found with this email address.`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Volunteer Connect account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">I am a:</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="volunteer"
                  checked={formData.userType === 'volunteer'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Volunteer
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="organization"
                  checked={formData.userType === 'organization'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Organization
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your email"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-semibold ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 space-y-2">
          <p className="text-gray-600">Don't have an account?</p>
          <div className="space-x-4">
            <a href="/signup/volunteer" className="text-blue-600 hover:underline">
              Sign up as Volunteer
            </a>
            <span className="text-gray-400">|</span>
            <a href="/signup/organization" className="text-blue-600 hover:underline">
              Sign up as Organization
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}