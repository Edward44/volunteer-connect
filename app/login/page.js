'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

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
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section with Login Form */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome back to 
                  <span className="text-emerald-600"> Bono</span>
                </h1>
                <p className="text-xl text-gray-600">
                  Sign in to continue making a difference
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                      I am signing in as:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.userType === 'volunteer' 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}>
                        <input
                          type="radio"
                          name="userType"
                          value="volunteer"
                          checked={formData.userType === 'volunteer'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">🤝</div>
                          <span className="font-medium">Volunteer</span>
                        </div>
                      </label>
                      
                      <label className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.userType === 'organization' 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}>
                        <input
                          type="radio"
                          name="userType"
                          value="organization"
                          checked={formData.userType === 'organization'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">🏢</div>
                          <span className="font-medium">Organization</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        error ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing In...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                {/* Sign Up Links */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-center text-gray-600 mb-4">Don't have an account?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a 
                      href="/signup/volunteer" 
                      className="inline-flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 text-center"
                    >
                      <span className="mr-2">🤝</span>
                      Join as Volunteer
                    </a>
                    <a 
                      href="/signup/organization" 
                      className="inline-flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 text-center"
                    >
                      <span className="mr-2">🏢</span>
                      Join as Organization
                    </a>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-center mt-8">
                <p className="text-gray-500 text-sm">
                  By signing in, you agree to connect with meaningful volunteer opportunities 
                  and help build stronger communities together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Simplified */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Join thousands making a difference</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-3xl mb-3">🌍</div>
                <h3 className="font-semibold text-gray-900 mb-2">Make an Impact</h3>
                <p className="text-gray-600 text-sm">Create positive change in your community</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="font-semibold text-gray-900 mb-2">Connect</h3>
                <p className="text-gray-600 text-sm">Meet like-minded people who care</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-3xl mb-3">💪</div>
                <h3 className="font-semibold text-gray-900 mb-2">Grow</h3>
                <p className="text-gray-600 text-sm">Build skills and experience</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}