'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function AllApplications() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample opportunities data to match with applications
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

  useEffect(() => {
    // Check if user is logged in and is a volunteer
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn || !user || user.userType !== 'volunteer') {
      router.push('/login');
      return;
    }

    setCurrentUser(user);
    loadApplications(user);
  }, [router]);

  useEffect(() => {
    // Filter applications based on status and search term
    let filtered = applications;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.opportunityTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchTerm]);

  const loadApplications = (user) => {
    try {
      // Load all opportunities (sample + custom)
      const savedOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      const allOpportunities = [...sampleOpportunities, ...savedOpportunities];

      // Get user's applied opportunities from their profile
      const appliedOpportunityIds = user.appliedOpportunities || [];
      
      // Create detailed application objects
      const userApplications = appliedOpportunityIds.map((opportunityId, index) => {
        const opportunity = allOpportunities.find(opp => opp.id === opportunityId);
        
        // Generate some realistic sample data for demo purposes
        const statuses = ['pending', 'accepted', 'rejected'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Generate dates - some recent, some older
        const daysAgo = Math.floor(Math.random() * 30) + 1;
        const appliedDate = new Date();
        appliedDate.setDate(appliedDate.getDate() - daysAgo);

        return {
          id: `app_${opportunityId}_${user.id}`,
          volunteerId: user.id,
          opportunityId: opportunityId,
          status: index === 0 ? 'pending' : randomStatus, // Keep first one pending for demo
          appliedAt: appliedDate.toISOString(),
          volunteerName: user.name,
          volunteerEmail: user.email,
          opportunityTitle: opportunity?.title || 'Unknown Opportunity',
          organization: opportunity?.organization || 'Unknown Organization',
          location: opportunity?.location || 'Unknown Location',
          date: opportunity?.date || 'TBD',
          time: opportunity?.time || 'TBD',
          category: opportunity?.category || 'General',
          description: opportunity?.description || 'No description available',
          volunteerHours: opportunity?.volunteerHours || 0
        };
      });

      setApplications(userApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full";
    
    switch (status) {
      case 'accepted':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const withdrawApplication = (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        // Remove from applications list
        const updatedApplications = applications.filter(app => app.id !== applicationId);
        setApplications(updatedApplications);

        // Update user's applied opportunities
        const app = applications.find(a => a.id === applicationId);
        if (app && currentUser) {
          const updatedUser = {
            ...currentUser,
            appliedOpportunities: currentUser.appliedOpportunities.filter(id => id !== app.opportunityId)
          };

          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);

          // Update all users in localStorage
          const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
          const updatedUsers = allUsers.map(user => 
            user.id === currentUser.id ? updatedUser : user
          );
          localStorage.setItem('users', JSON.stringify(updatedUsers));
        }

        alert('Application withdrawn successfully!');
      } catch (error) {
        console.error('Error withdrawing application:', error);
        alert('Error withdrawing application. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your applications...</p>
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
        <section className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                <p className="text-gray-600 mt-2">Track all your volunteer application submissions</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => router.push('/account/volunteer')}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-xl font-bold text-gray-900">{applications.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-xl font-bold text-gray-900">
                      {applications.filter(app => app.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Accepted</p>
                    <p className="text-xl font-bold text-gray-900">
                      {applications.filter(app => app.status === 'accepted').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Rejected</p>
                    <p className="text-xl font-bold text-gray-900">
                      {applications.filter(app => app.status === 'rejected').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Filter by Status
                    </label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                      Search Applications
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by opportunity, organization, or category..."
                        className="border border-gray-300 rounded-md pl-10 pr-3 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Showing {filteredApplications.length} of {applications.length} applications
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Applications List */}
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-6">
            {applications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600 mb-6">You haven't submitted any volunteer applications yet.</p>
                <button
                  onClick={() => router.push('/opportunities')}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Browse Opportunities
                </button>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No matching applications</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setSearchTerm('');
                  }}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div key={application.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {application.opportunityTitle}
                              </h3>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {application.category}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 mb-2">{application.organization}</p>
                            <p className="text-sm text-gray-500 mb-3">{application.location}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {application.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {application.time}
                              </div>
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {application.volunteerHours} hours
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(application.status)}
                              <span className={getStatusBadge(application.status)}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Applied on</p>
                              <p className="text-sm font-medium text-gray-700">
                                {new Date(application.appliedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {application.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      
                      
                      {application.status === 'pending' && (
                        <button
                          onClick={() => withdrawApplication(application.id)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Withdraw Application
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}