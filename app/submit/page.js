'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function PostOpportunityPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    location: '',
    date: '',
    time: '',
    category: '',
    description: '',
    maxVolunteers: '',
    contactEmail: '',
    contactPhone: '',
    requirements: '',
    benefits: '',
    volunteerHours: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = ['Environment', 'Community', 'Education', 'Healthcare', 'Sports & Recreation', 'Arts & Culture', 'Animal Welfare', 'Senior Care'];

  // Check authentication on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
    setIsLoading(false);
    
    // Pre-fill organization and contact email if user is logged in and is an organization
    if (user && user.userType === 'organization') {
      setFormData(prev => ({
        ...prev,
        organization: user.orgName || '',
        contactEmail: user.email || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.organization.trim()) newErrors.organization = 'Organization name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time.trim()) newErrors.time = 'Time is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.volunteerHours.trim()) newErrors.volunteerHours = 'Please enter the duration of this opportunity';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!formData.contactEmail.includes('@')) newErrors.contactEmail = 'Please enter a valid email';
    if (formData.maxVolunteers < 1) newErrors.maxVolunteers = 'Must need at least 1 volunteer';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      // Create new opportunity object
      const newOpportunity = {
        id: Date.now(),
        ...formData,
        volunteers: 0,
        datePosted: new Date().toISOString(),
        status: 'active',
        postedBy: currentUser.id,
        postedByName: currentUser.orgName || currentUser.name
      };

      // Get existing opportunities from localStorage
      const existingOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      
      // Add new opportunity
      const updatedOpportunities = [...existingOpportunities, newOpportunity];
      
      // Save to storage
      localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities));
      
      // Show success message
      setShowSuccess(true);
      
      // Clear form
      setFormData({
        title: '',
        organization: currentUser.orgName || '',
        location: '',
        date: '',
        time: '',
        category: '',
        description: '',
        maxVolunteers: '',
        contactEmail: currentUser.email || '',
        contactPhone: '',
        requirements: '',
        benefits: '',
        volunteerHours: ''
      });

      // Hide success message and redirect after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/opportunities');
      }, 2000);

    } catch (error) {
      console.error('Error posting opportunity:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      </>
    );
  }

  // Show access denied if user is not logged in or not an organization
  if (!currentUser || currentUser.userType !== 'organization') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Organization Account Required</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Only registered organizations can post volunteer opportunities. 
                {!currentUser ? ' Please sign in to your organization account to continue.' : ' Your current account type does not have permission to post opportunities.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!currentUser ? (
                  <>
                    <Link 
                      href="/login" 
                      className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign In as Organization
                    </Link>
                    
                    <Link 
                      href="/signup/organization" 
                      className="inline-flex items-center justify-center px-6 py-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
                    >
                      <span className="mr-2">🏢</span>
                      Register Organization
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/opportunities" 
                      className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Browse Opportunities
                    </Link>
                    
                    <Link 
                      href="/signup/organization" 
                      className="inline-flex items-center justify-center px-6 py-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
                    >
                      <span className="mr-2">🏢</span>
                      Register as Organization
                    </Link>
                  </>
                )}
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Why organizations only?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl mb-2">🏢</div>
                    <h4 className="font-medium text-gray-900 mb-2">Verification</h4>
                    <p className="text-sm text-gray-600">Ensures all opportunities come from legitimate organizations</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl mb-2">📋</div>
                    <h4 className="font-medium text-gray-900 mb-2">Accountability</h4>
                    <p className="text-sm text-gray-600">Organizations provide proper oversight and support</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl mb-2">✅</div>
                    <h4 className="font-medium text-gray-900 mb-2">Quality</h4>
                    <p className="text-sm text-gray-600">Maintains high standards for volunteer experiences</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Show the form if user is authenticated and is an organization
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Post a Volunteer Opportunity</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Connect with passionate volunteers in your community and make a difference together
              </p>
              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <span className="mr-2">👋</span>
                Welcome back, {currentUser.orgName || currentUser.name}!
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Success Message */}
          {showSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-lg mb-8 flex items-center">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold">Opportunity posted successfully!</p>
                <p className="text-sm">Redirecting you to the opportunities page...</p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opportunity Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border text-gray-900 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Community Garden Cleanup"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        errors.organization ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your organization name"
                    />
                    {errors.organization && <p className="text-red-500 text-sm mt-1">{errors.organization}</p>}
                  </div>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="contact@yourorganization.org"
                    />
                    {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Location and Schedule */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
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
                      placeholder="Full address or location description"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="text"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        errors.time ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 9:00 AM - 12:00 PM"
                    />
                    {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                  </div>
                </div>
              </div>

              {/* Category and Volunteers */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Volunteers Needed *
                    </label>
                    <input
                      type="number"
                      name="maxVolunteers"
                      value={formData.maxVolunteers}
                      onChange={handleChange}
                      min="1"
                      className={`nw-full px-4 py-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        errors.maxVolunteers ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.maxVolunteers && <p className="text-red-500 text-sm mt-1">{errors.maxVolunteers}</p>}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the volunteer opportunity, what volunteers will be doing, and any important details..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              
              {/* Volunteer Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volunteer Hours *
                </label>
                <input
                  type="text"
                  name="volunteerHours"
                  value={formData.volunteerHours}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.volunteerHours ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 3 hours, Half day, Full day"
                />
                {errors.volunteerHours && <p className="text-red-500 text-sm mt-1">{errors.volunteerHours}</p>}
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements (Optional)
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Any specific skills, experience, or requirements for volunteers..."
                />
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits for Volunteers (Optional)
                </label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="What will volunteers gain from this experience? (community service hours, skills, networking, etc.)"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 md:flex-none md:px-8 py-4 font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isSubmitting ? 'Posting Opportunity...' : 'Post Opportunity'}
                </button>
                
                <button
                  type="button"
                  onClick={() => router.push('/opportunities')}
                  className="flex-1 md:flex-none md:px-8 py-4 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips for a Great Volunteer Opportunity Post</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Be specific about what volunteers will be doing and what to expect</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Include any materials or clothing volunteers should bring</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Mention if training will be provided or if experience is required</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Highlight the impact volunteers will make in the community</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}