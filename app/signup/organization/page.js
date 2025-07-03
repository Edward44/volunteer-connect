'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      
      // Set current user session and authentication state
      localStorage.setItem('currentUser', JSON.stringify(newOrganization));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userType', 'organization');
      
      // Force a page reload to ensure authentication state is recognized
      // or use window.location.href for a hard redirect
      alert('Organization account created successfully! Welcome to Bono!');
      
      // Option 1: Hard redirect (bypasses Next.js router)
      window.location.href = '/account/organization';
      
      // Option 2: If you want to use Next.js router, add a longer delay
      // setTimeout(() => {
      //   router.push('/account/organization');
      // }, 500);
      
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
            <span className="text-emerald-600">Bono</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join as an Organization</h1>
            <p className="text-gray-600">Create your account to start posting volunteer opportunities</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      errors.orgName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your organization name"
                  />
                  {errors.orgName && <p className="text-red-500 text-sm mt-1">{errors.orgName}</p>}
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
                    className={`w-full px-4 py-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="contact@yourorganization.org"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="City, State"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website (https://)
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="https://yourorganization.org"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry/Mission *
                </label>
                <textarea
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.industry ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={3}
                  placeholder="Describe your organization's mission and focus area"
                />
                {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  rows={4}
                  placeholder="Tell volunteers more about your organization, its history, values, and impact..."
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-emerald-800">
                      Ready to make an impact?
                    </h3>
                    <div className="mt-2 text-sm text-emerald-700">
                      <p>
                        Once your account is created, you'll be able to post volunteer opportunities,
                        manage applications, and connect with passionate volunteers in your community.
                      </p>
                    </div>
                  </div>
                </div>
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
                {isSubmitting ? 'Creating Account...' : 'Create Organization Account'}
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
              Looking to volunteer instead?{' '}
              <Link href="/signup/volunteer" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Sign up as a volunteer
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}