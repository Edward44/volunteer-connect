'use client'

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';

export default function OpportunitiesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [opportunities, setOpportunities] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Sample opportunities data (initial data) - Updated with volunteer hours
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

  const categories = ['all', 'Environment', 'Community', 'Education', 'Healthcare'];

  // Load opportunities and current user on component mount
  useEffect(() => {
    const savedOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
    setOpportunities([...sampleOpportunities, ...savedOpportunities]);
    
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
  }, []);

  // Save opportunities to localStorage
  const saveOpportunities = (updatedOpportunities) => {
    const customOpportunities = updatedOpportunities.filter(opp => opp.id > 1000); // Only save custom ones
    localStorage.setItem('opportunities', JSON.stringify(customOpportunities));
  };

  // Handle Post Opportunity button click - Navigate to submit page
  const handlePostOpportunityClick = () => {
    if (!currentUser) {
      // Show alert and redirect to login if not signed in
      alert('Please sign in to post a volunteer opportunity.');
      router.push('/login');
      return;
    }
    
    // Only organizations should be able to post opportunities
    if (currentUser.userType !== 'organization') {
      alert('Only organizations can post volunteer opportunities. Please sign in with an organization account.');
      return;
    }
    
    // Navigate to submit page
    router.push('/submit');
  };

  // Handle delete opportunity
  const handleDeleteOpportunity = (opportunityId) => {
    const opportunity = opportunities.find(opp => opp.id === opportunityId);
    
    // Check if user is authorized to delete this opportunity
    if (!currentUser || currentUser.userType !== 'organization') {
      alert('Only organizations can delete opportunities.');
      return;
    }
    
    // Check if this opportunity was posted by the current user
    if (opportunity.postedBy && opportunity.postedBy !== currentUser.id) {
      alert('You can only delete opportunities that you posted.');
      return;
    }
    
    // Confirm deletion
    if (window.confirm(`Are you sure you want to delete "${opportunity.title}"? This action cannot be undone.`)) {
      const updatedOpportunities = opportunities.filter(opp => opp.id !== opportunityId);
      setOpportunities(updatedOpportunities);
      saveOpportunities(updatedOpportunities);
      alert('Opportunity deleted successfully.');
    }
  };

  // Function to check if current user can delete an opportunity
  const canDeleteOpportunity = (opportunity) => {
    if (!currentUser || currentUser.userType !== 'organization') return false;
    // For sample opportunities (id <= 1000), check if user is logged in as organization
    if (opportunity.id <= 1000) return true;
    // For custom opportunities, check if posted by current user
    return opportunity.postedBy === currentUser.id;
  };

  // Handle sign up button click - Navigate to signup page
  const handleSignUpClick = (opportunity) => {
    // Check if user is logged in
    if (!currentUser) {
      alert('Please sign in to volunteer for opportunities.');
      router.push('/login');
      return;
    }

    // Check if user is a volunteer
    if (currentUser.userType !== 'volunteer') {
      alert('Only volunteers can sign up for opportunities. Please sign in with a volunteer account.');
      return;
    }

    // Check if opportunity is full
    if (opportunity.volunteers >= opportunity.maxVolunteers) {
      alert('Sorry, this opportunity is full!');
      return;
    }

    // Check if user already applied
    if (currentUser.appliedOpportunities && 
        currentUser.appliedOpportunities.includes(opportunity.id)) {
      alert('You have already applied to this opportunity!');
      return;
    }

    // Store the selected opportunity in localStorage for the signup page
    localStorage.setItem('selectedOpportunity', JSON.stringify(opportunity));
    
    // Navigate to signup page
    router.push('/volunteer-signup');
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || opp.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    const colors = {
      Environment: 'bg-green-100 text-green-800',
      Community: 'bg-blue-100 text-blue-800',
      Education: 'bg-purple-100 text-purple-800',
      Healthcare: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Check if user already applied to an opportunity
  const hasUserApplied = (opportunityId) => {
    if (!currentUser || currentUser.userType !== 'volunteer') return false;
    return currentUser.appliedOpportunities && currentUser.appliedOpportunities.includes(opportunityId);
  };

  // Check if user can sign up (must be logged in as volunteer)
  const canSignUp = () => {
    return currentUser && currentUser.userType === 'volunteer';
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Volunteer Opportunities</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover meaningful ways to make a difference in your community
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Available Opportunities</h2>
              <p className="text-gray-600 mt-1">Find the perfect way to make a difference</p>
            </div>
            
            <button
              onClick={handlePostOpportunityClick}
              className="bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Post New Opportunity
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Opportunities
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, organization, or location..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="md:w-64">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredOpportunities.length} of {opportunities.length} opportunities
            </p>
          </div>

          {/* Opportunities Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOpportunities.map(opportunity => (
              <div key={opportunity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative">
                {/* Delete Button - Only show for organizations who can delete */}
                {canDeleteOpportunity(opportunity) && (
                  <button
                    onClick={() => handleDeleteOpportunity(opportunity.id)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Delete opportunity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}

                {/* Category Badge and Hours */}
                <div className="mb-4 flex justify-between items-center pr-8">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(opportunity.category)}`}>
                    {opportunity.category}
                  </span>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    {opportunity.volunteerHours} {opportunity.volunteerHours === 1 ? 'hour' : 'hours'}
                  </span>
                </div>

                {/* Title and Organization */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{opportunity.title}</h3>
                <p className="text-emerald-600 font-medium mb-4">{opportunity.organization}</p>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {opportunity.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M3 13a4 4 0 714-4h10a4 4 0 014 4v6a4 4 0 01-4 4H7a4 4 0 01-4-4v-6z" />
                    </svg>
                    {opportunity.date}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {opportunity.time}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{opportunity.description}</p>

                {/* Volunteer Count */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {opportunity.volunteers}/{opportunity.maxVolunteers} volunteers
                    </span>
                    <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((opportunity.volunteers / opportunity.maxVolunteers) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className={opportunity.volunteers >= opportunity.maxVolunteers ? 'text-red-500 font-medium' : ''}>
                      {opportunity.volunteers >= opportunity.maxVolunteers ? 'Full' : 'Available'}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleSignUpClick(opportunity)}
                  disabled={opportunity.volunteers >= opportunity.maxVolunteers || hasUserApplied(opportunity.id) || !canSignUp()}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    opportunity.volunteers >= opportunity.maxVolunteers || hasUserApplied(opportunity.id) || !canSignUp()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md'
                  }`}
                >
                  {!currentUser 
                    ? 'Sign In to Volunteer'
                    : currentUser.userType !== 'volunteer'
                    ? 'Volunteers Only'
                    : hasUserApplied(opportunity.id) 
                    ? 'Already Applied' 
                    : opportunity.volunteers >= opportunity.maxVolunteers 
                      ? 'Opportunity Full' 
                      : 'Sign Up to Volunteer'
                  }
                </button>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredOpportunities.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.34-1.263-5.452-3.151M5 6.757l.707.707a1 1 0 001.414 0l.707-.707a1 1 0 000-1.414l-.707-.707a1 1 0 00-1.414 0L5 6.757v0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No opportunities found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or category filter to find more opportunities.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}