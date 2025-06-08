'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Join as a Volunteer</h1>
          <p className="text-gray-600">Create your account to start volunteering</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name *</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className={`w-full border p-3 rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email Address *</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className={`w-full border p-3 rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Location *</label>
            <input 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              className={`w-full border p-3 rounded-lg ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="City, State"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
            <input 
              type="tel"
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className="w-full border border-gray-300 p-3 rounded-lg"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Interests/Skills</label>
            <textarea 
              name="interests" 
              value={formData.interests} 
              onChange={handleChange} 
              className="w-full border border-gray-300 p-3 rounded-lg"
              rows={3}
              placeholder="What causes interest you? Any special skills?"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Availability</label>
            <select 
              name="availability" 
              value={formData.availability} 
              onChange={handleChange} 
              className="w-full border border-gray-300 p-3 rounded-lg"
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
            className={`w-full py-3 px-4 rounded-lg font-semibold ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Volunteer Account'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}