'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function VolunteerSignupPage() {
  const router = useRouter();
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get the selected opportunity from localStorage
    const opportunity = JSON.parse(localStorage.getItem('selectedOpportunity') || 'null');
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!opportunity) {
      // Redirect back to opportunities if no opportunity selected
      router.push('/opportunities');
      return;
    }

    if (!user || user.userType !== 'volunteer') {
      // Redirect to login if not logged in as volunteer
      alert('Please sign in as a volunteer to access this page.');
      router.push('/login');
      return;
    }

    setSelectedOpportunity(opportunity);
    setCurrentUser(user);

    // Auto-fill form with user information
    setSignupForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      message: ''
    });
  }, [router]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setSignupForm({
      ...signupForm,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get current opportunities
      const sampleOpportunities = [
        {
          id: 1,
          title: "Beach Cleanup Volunteer",
          organization: "Ocean Conservation Society",
          location: "Santa Monica Beach, CA",
          date: "June 15, 2025",
          time: "9:00 AM - 12:00 PM",
          category: "Environment",
          description: "Join us for a morning of beach cleanup to protect marine life and keep our coastlines beautiful.",
          volunteers: 12,
          maxVolunteers: 20,
          volunteerHours: 3
        },
        {
          id: 2,
          title: "Food Bank Assistant",
          organization: "Community Food Network",
          location: "Downtown Food Bank",
          date: "June 18, 2025",
          time: "2:00 PM - 6:00 PM",
          category: "Community",
          description: "Help sort and distribute food to families in need. No experience required - training provided.",
          volunteers: 8,
          maxVolunteers: 15,
          volunteerHours: 4
        },
        {
          id: 3,
          title: "Reading Tutor for Kids",
          organization: "Literacy First",
          location: "Lincoln Elementary School",
          date: "June 20, 2025",
          time: "3:30 PM - 5:30 PM",
          category: "Education",
          description: "Support elementary students with reading skills through one-on-one tutoring sessions.",
          volunteers: 5,
          maxVolunteers: 10,
          volunteerHours: 2
        },
        {
          id: 4,
          title: "Senior Center Activities",
          organization: "Golden Years Community Center",
          location: "Riverside Senior Center",
          date: "June 22, 2025",
          time: "1:00 PM - 4:00 PM",
          category: "Healthcare",
          description: "Lead recreational activities and provide companionship for seniors in our community.",
          volunteers: 3,
          maxVolunteers: 8,
          volunteerHours: 3
        }
      ];

      const savedOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      const allOpportunities = [...sampleOpportunities, ...savedOpportunities];

      // Update opportunity volunteer count
      const updatedOpportunities = allOpportunities.map(opp => {
        if (opp.id === selectedOpportunity.id) {
          return { ...opp, volunteers: opp.volunteers + 1 };
        }
        return opp;
      });

      // Save updated opportunities
      const customOpportunities = updatedOpportunities.filter(opp => opp.id > 1000);
      localStorage.setItem('opportunities', JSON.stringify(customOpportunities));

      // Update volunteer's applied opportunities
      const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
      const updatedVolunteers = volunteers.map(vol => {
        if (vol.id === currentUser.id) {
          const appliedOpportunities = vol.appliedOpportunities || [];
          return {
            ...vol,
            appliedOpportunities: [...appliedOpportunities, selectedOpportunity.id]
          };
        }
        return vol;
      });
      localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));

      // Update current user in localStorage
      const updatedUser = {
        ...currentUser,
        appliedOpportunities: [...(currentUser.appliedOpportunities || []), selectedOpportunity.id]
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Clear the selected opportunity from localStorage
      localStorage.removeItem('selectedOpportunity');

      // Show success message and redirect
      alert('Successfully signed up! You will be contacted with more details.');
      router.push('/opportunities');

    } catch (error) {
      console.error('Error submitting signup:', error);
      alert('There was an error signing up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    localStorage.removeItem('selectedOpportunity');
    router.push('/opportunities');
  };

  if (!selectedOpportunity || !currentUser) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div>
              <button
                onClick={handleCancel}
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Opportunities
              </button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up to Volunteer</h1>
              <p className="text-gray-600">
                Complete your volunteer application for this opportunity
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Opportunity Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Opportunity Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedOpportunity.title}</h3>
                  <p className="text-emerald-600 font-medium">{selectedOpportunity.organization}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{selectedOpportunity.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6h4v4m0 0H8m4 0V3m0 0L8 3m0 0v4h4V3M8 3h4" />
                    </svg>
                    <span>{selectedOpportunity.date}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{selectedOpportunity.time}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{selectedOpportunity.volunteers}/{selectedOpportunity.maxVolunteers} volunteers</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{selectedOpportunity.volunteerHours} volunteer hours</span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 text-sm">{selectedOpportunity.description}</p>
                </div>

                <div className="mt-4">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
                    {selectedOpportunity.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Signup Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={signupForm.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={signupForm.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={signupForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={signupForm.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900 placeholder-gray-400"
                    placeholder="City, State"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={signupForm.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none text-gray-900 placeholder-gray-400"
                    placeholder="Tell the organization why you want to volunteer for this opportunity..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </div>
                    ) : (
                      'Sign Up to Volunteer'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}