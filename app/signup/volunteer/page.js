'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VolunteerSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    phone: '',
    interests: '',
    availability: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    // Check if email already exists
    const existingVolunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
    const emailExists = existingVolunteers.some(vol => vol.email.toLowerCase() === formData.email.toLowerCase());
    if (emailExists) {
      newErrors.email = 'An account with this email already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create new volunteer object
      const newVolunteer = {
        id: Date.now(),
        ...formData,
        userType: 'volunteer',
        dateRegistered: new Date().toISOString(),
        appliedOpportunities: []
      };
      
      // Get existing volunteers
      const existingVolunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
      
      // Add new volunteer
      const updatedVolunteers = [...existingVolunteers, newVolunteer];
      
      // Save to storage
      localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
      
      // Set current user session
      localStorage.setItem('currentUser', JSON.stringify(newVolunteer));
      
      // Success! Redirect to dashboard
      alert('Account created successfully! Welcome to Volunteer Connect!');
      router.push('/dashboard/volunteer');
      
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Volunteer<span className="text-emerald-600">Connect</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join as a Volunteer</h1>
            <p className="text-gray-600">Create your account to start making a difference</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="City, State"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input 
                  type="tel"
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests & Skills
                </label>
                <textarea 
                  name="interests" 
                  value={formData.interests} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  rows={3}
                  placeholder="What causes interest you? Any special skills you'd like to contribute?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select 
                  name="availability" 
                  value={formData.availability} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  <option value="">Select your availability</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="evenings">Evenings</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Volunteer Account'}
              </button>
            </form>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Sign in here
              </Link>
            </p>
            <p className="text-gray-600">
              Want to post opportunities?{' '}
              <Link href="/signup/organization" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Sign up as an organization
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}