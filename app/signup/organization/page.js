'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrganizationSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    orgName: '',
    email: '',
    location: '',
    industry: '',
    website: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
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
    
    if (!formData.orgName.trim()) newErrors.orgName = 'Organization name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.industry.trim()) newErrors.industry = 'Industry/mission is required';
    
    // Check if email already exists
    const existingOrgs = JSON.parse(localStorage.getItem('organizations') || '[]');
    const emailExists = existingOrgs.some(org => org.email.toLowerCase() === formData.email.toLowerCase());
    if (emailExists) {
      newErrors.email = 'An organization with this email already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create new organization object
      const newOrganization = {
        id: Date.now(),
        ...formData,
        userType: 'organization',
        dateRegistered: new Date().toISOString(),
        postedOpportunities: []
      };
      
      // Get existing organizations
      const existingOrgs = JSON.parse(localStorage.getItem('organizations') || '[]');
      
      // Add new organization
      const updatedOrgs = [...existingOrgs, newOrganization];
      
      // Save to storage
      localStorage.setItem('organizations', JSON.stringify(updatedOrgs));
      
      // Set current user session
      localStorage.setItem('currentUser', JSON.stringify(newOrganization));
      
      // Success! Redirect to dashboard
      alert('Organization account created successfully! Welcome to Volunteer Connect!');
      router.push('/dashboard/organization');
      
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
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Join as an Organization</h1>
          <p className="text-gray-600">Create your account to post volunteer opportunities</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Organization Name *</label>
            <input
              type="text"
              name="orgName"
              value={formData.orgName}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg ${errors.orgName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your organization name"
            />
            {errors.orgName && <p className="text-red-500 text-sm mt-1">{errors.orgName}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="contact@yourorganization.org"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="City, State"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Industry/Mission *</label>
            <textarea
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg ${errors.industry ? 'border-red-500' : 'border-gray-300'}`}
              rows={3}
              placeholder="Describe your organization's mission and focus area"
            />
            {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg"
              placeholder="https://yourorganization.org"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg"
              rows={3}
              placeholder="Tell volunteers more about your organization..."
            />
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
            {isSubmitting ? 'Creating Account...' : 'Create Organization Account'}
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