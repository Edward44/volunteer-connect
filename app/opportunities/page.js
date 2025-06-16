'use client'

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function OpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showPostForm, setShowPostForm] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    organization: '',
    location: '',
    date: '',
    time: '',
    category: '',
    description: '',
    maxVolunteers: 10
  });

  // Sample opportunities data (initial data)
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
      maxVolunteers: 20
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
      maxVolunteers: 15
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
      maxVolunteers: 10
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
      maxVolunteers: 8
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

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewOpportunity({
      ...newOpportunity,
      [e.target.name]: e.target.value
    });
  };

  // Handle signup form input changes
  const handleSignupInputChange = (e) => {
    setSignupForm({
      ...signupForm,
      [e.target.name]: e.target.value
    });
  };

  // Handle Post Opportunity button click - Check authentication first
  const handlePostOpportunityClick = () => {
    if (!currentUser) {
      // Show alert and redirect to login if not signed in
      alert('Please sign in to post a volunteer opportunity.');
      window.location.href = '/login';
      return;
    }
    
    // Only organizations should be able to post opportunities
    if (currentUser.userType !== 'organization') {
      alert('Only organizations can post volunteer opportunities. Please sign in with an organization account.');
      return;
    }
    
    // If authenticated as organization, show the form
    setShowPostForm(true);
  };

  // Handle form submission
  const handleSubmitOpportunity = (e) => {
    e.preventDefault();
    
    // Double-check authentication (safety measure)
    if (!currentUser || currentUser.userType !== 'organization') {
      alert('Authentication error. Please sign in again.');
      window.location.href = '/login';
      return;
    }
    
    const opportunity = {
      ...newOpportunity,
      id: Date.now(), // Simple ID generation
      volunteers: 0,
      maxVolunteers: parseInt(newOpportunity.maxVolunteers),
      postedBy: currentUser.id, // Track who posted this opportunity
      postedByName: currentUser.name || currentUser.organizationName || 'Unknown Organization'
    };
    
    const updatedOpportunities = [...opportunities, opportunity];
    setOpportunities(updatedOpportunities);
    saveOpportunities(updatedOpportunities);
    
    // Reset form
    setNewOpportunity({
      title: '',
      organization: '',
      location: '',
      date: '',
      time: '',
      category: '',
      description: '',
      maxVolunteers: 10
    });
    setShowPostForm(false);
    
    // Show success message
    alert('Opportunity posted successfully!');
  };

  // Handle sign up button click
  const handleSignUpClick = (opportunity) => {
    if (!currentUser) {
      // Redirect to login if not logged in
      window.location.href = '/login';
      return;
    }

    if (opportunity.volunteers >= opportunity.maxVolunteers) {
      alert('Sorry, this opportunity is full!');
      return;
    }

    // Check if user already applied
    if (currentUser.userType === 'volunteer') {
      const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
      const currentVolunteer = volunteers.find(vol => vol.id === currentUser.id);
      
      if (currentVolunteer && currentVolunteer.appliedOpportunities && 
          currentVolunteer.appliedOpportunities.includes(opportunity.id)) {
        alert('You have already applied to this opportunity!');
        return;
      }
    }

    setSelectedOpportunity(opportunity);
    
    // Pre-fill form with user data if available
    if (currentUser.userType === 'volunteer') {
      setSignupForm({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        message: ''
      });
    } else {
      setSignupForm({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    }
    
    setShowSignupModal(true);
  };

  // Handle signup form submission
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    
    // Update opportunity volunteer count
    const updatedOpportunities = opportunities.map(opp => {
      if (opp.id === selectedOpportunity.id) {
        return { ...opp, volunteers: opp.volunteers + 1 };
      }
      return opp;
    });
    setOpportunities(updatedOpportunities);
    saveOpportunities(updatedOpportunities);
    
    // If user is logged in as volunteer, update their applied opportunities
    if (currentUser && currentUser.userType === 'volunteer') {
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
      setCurrentUser(updatedUser);
    }
    
    // Close modal and reset form
    setShowSignupModal(false);
    setSignupForm({ name: '', email: '', phone: '', message: '' });
    setSelectedOpportunity(null);
    
    // Show success message
    alert('Successfully signed up! You will be contacted with more details.');
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
              className="bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Post New Opportunity
            </button>
          </div>

          {/* Post Opportunity Form Modal */}
          {showPostForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Post New Opportunity</h3>
                    <button
                      onClick={() => setShowPostForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSubmitOpportunity} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={newOpportunity.title}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Opportunity title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Organization *
                        </label>
                        <input
                          type="text"
                          name="organization"
                          value={newOpportunity.organization}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Your organization"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location *
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={newOpportunity.location}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Address or location"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={newOpportunity.category}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">Select category</option>
                          <option value="Environment">Environment</option>
                          <option value="Community">Community</option>
                          <option value="Education">Education</option>
                          <option value="Healthcare">Healthcare</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date *
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={newOpportunity.date}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time *
                        </label>
                        <input
                          type="text"
                          name="time"
                          value={newOpportunity.time}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="e.g., 9:00 AM - 12:00 PM"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Volunteers *
                        </label>
                        <input
                          type="number"
                          name="maxVolunteers"
                          value={newOpportunity.maxVolunteers}
                          onChange={handleInputChange}
                          required
                          min="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={newOpportunity.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Describe the volunteer opportunity..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-all duration-200"
                      >
                        Post Opportunity
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPostForm(false)}
                        className="flex-1 bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-400 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Signup Modal */}
          {showSignupModal && selectedOpportunity && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-lg w-full">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Sign Up to Volunteer</h3>
                    <button
                      onClick={() => setShowSignupModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">{selectedOpportunity.title}</h4>
                    <p className="text-emerald-600">{selectedOpportunity.organization}</p>
                    <p className="text-gray-600">{selectedOpportunity.date} • {selectedOpportunity.time}</p>
                    <p className="text-gray-600">{selectedOpportunity.location}</p>
                  </div>

                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={signupForm.name}
                        onChange={handleSignupInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={signupForm.email}
                        onChange={handleSignupInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={signupForm.phone}
                        onChange={handleSignupInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        name="message"
                        value={signupForm.message}
                        onChange={handleSignupInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Tell us why you're interested or any relevant experience..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-all duration-200"
                      >
                        Complete Sign Up
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSignupModal(false)}
                        className="flex-1 bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-400 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

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
              <div key={opportunity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                {/* Category Badge */}
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(opportunity.category)}`}>
                    {opportunity.category}
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
                <p className="text-gray-600 mb-4 line-clamp-3">{opportunity.description}</p>

                {/* Volunteer Count */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Volunteers</span>
                    <span className="text-sm font-medium text-gray-900">
                      {opportunity.volunteers}/{opportunity.maxVolunteers}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${(opportunity.volunteers / opportunity.maxVolunteers) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                {hasUserApplied(opportunity.id) ? (
                  <button 
                    disabled
                    className="w-full bg-gray-300 text-gray-500 font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
                  >
                    Already Applied
                  </button>
                ) : opportunity.volunteers >= opportunity.maxVolunteers ? (
                  <button 
                    disabled
                    className="w-full bg-gray-300 text-gray-500 font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
                  >
                    Opportunity Full
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSignUpClick(opportunity)}
                   className="w-full bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-all duration-200"
                 >
                   Sign Up
                 </button>
               )}
             </div>
           ))}
         </div>

         {/* No Results Message */}
         {filteredOpportunities.length === 0 && (
           <div className="text-center py-12">
             <div className="text-gray-400 mb-4">
               <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.441.935-6.001 2.456M16 21v-2a4 4 0 00-3-3.87M8 21v-2a4 4 0 013-3.87M12 3v2.25" />
               </svg>
             </div>
             <h3 className="text-xl font-medium text-gray-900 mb-2">No opportunities found</h3>
             <p className="text-gray-500">Try adjusting your search criteria or check back later for new opportunities.</p>
           </div>
         )}
       </div>
     </main>
   </>
 );
}