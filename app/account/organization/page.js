'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function OrganizationDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [myOpportunities, setMyOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample opportunities data (same as volunteer dashboard)
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
    // Check if user is logged in and is an organization
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn || !user || user.userType !== 'organization') {
      router.push('/login');
      return;
    }

    setCurrentUser(user);
    loadDashboardData(user);
  }, [router]);

  const loadDashboardData = (user) => {
    try {
      // Load all opportunities (sample + custom)
      const savedOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      const allOpportunities = [...sampleOpportunities, ...savedOpportunities];
      
      // Filter opportunities for this organization - check multiple fields
      const orgOpportunities = allOpportunities.filter(opp => {
        // Check if opportunity was created by this organization
        if (opp.organizationId === user.id) return true;
        
        // Check if organization name matches (for backward compatibility)
        if (opp.organization === user.name) return true;
        
        // Check if organizationName matches (in case the form uses this field)
        if (opp.organizationName === user.name) return true;
        
        // Check if createdBy matches the user ID
        if (opp.createdBy === user.id) return true;
        
        return false;
      });
      
      console.log('Current user:', user);
      console.log('All opportunities:', allOpportunities);
      console.log('Filtered org opportunities:', orgOpportunities);
      
      setMyOpportunities(orgOpportunities);

      // Get all users to find applications
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const volunteers = allUsers.filter(u => u.userType === 'volunteer');
      
      // Create application objects from volunteer applied opportunities
      const orgApplications = [];
      const opportunityIds = orgOpportunities.map(opp => opp.id);
      
      volunteers.forEach(volunteer => {
        if (volunteer.appliedOpportunities && volunteer.appliedOpportunities.length > 0) {
          volunteer.appliedOpportunities.forEach(opportunityId => {
            if (opportunityIds.includes(opportunityId)) {
              const opportunity = orgOpportunities.find(opp => opp.id === opportunityId);
              if (opportunity) {
                orgApplications.push({
                  id: `${volunteer.id}-${opportunityId}`, // Unique ID
                  volunteerId: volunteer.id,
                  opportunityId: opportunityId,
                  volunteerName: volunteer.name,
                  volunteerEmail: volunteer.email,
                  opportunityTitle: opportunity.title,
                  organization: opportunity.organization,
                  status: 'pending', // Default status
                  appliedAt: new Date().toISOString(), // You might want to track this better
                  message: `Application for ${opportunity.title}` // Default message
                });
              }
            }
          });
        }
      });

      setApplications(orgApplications);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a refresh function that can be called when returning from opportunity creation
  const refreshDashboard = () => {
    if (currentUser) {
      loadDashboardData(currentUser);
    }
  };

  // Listen for storage changes to refresh dashboard when opportunities are added
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'opportunities') {
        refreshDashboard();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser]);

  // Also refresh when the component becomes visible again (for same-tab navigation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && currentUser) {
        refreshDashboard();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  const handleApplicationStatus = (applicationId, newStatus) => {
    try {
      // Update applications in state
      const updatedApplications = applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      );
      setApplications(updatedApplications);
      
      // Store application status in a separate storage for persistence
      const applicationStatuses = JSON.parse(localStorage.getItem('applicationStatuses') || '{}');
      applicationStatuses[applicationId] = newStatus;
      localStorage.setItem('applicationStatuses', JSON.stringify(applicationStatuses));
      
      alert(`Application ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Error updating application. Please try again.');
    }
  };

  const deleteOpportunity = (opportunityId, e) => {
    // Prevent event bubbling to avoid triggering the card click
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      const opportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      const updatedOpportunities = opportunities.filter(opp => opp.id !== opportunityId);
      localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities));
      
      // Remove applications for this opportunity from all users
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = allUsers.map(user => {
        if (user.userType === 'volunteer' && user.appliedOpportunities) {
          return {
            ...user,
            appliedOpportunities: user.appliedOpportunities.filter(id => id !== opportunityId)
          };
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Remove application statuses for this opportunity
      const applicationStatuses = JSON.parse(localStorage.getItem('applicationStatuses') || '{}');
      Object.keys(applicationStatuses).forEach(key => {
        if (key.includes(`-${opportunityId}`)) {
          delete applicationStatuses[key];
        }
      });
      localStorage.setItem('applicationStatuses', JSON.stringify(applicationStatuses));
      
      loadDashboardData(currentUser);
      alert('Opportunity deleted successfully!');
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      alert('Error deleting opportunity. Please try again.');
    }
  };

  const handleOpportunityClick = (opportunityId) => {
    // Navigate to opportunity-applications page with the opportunity ID
    router.push(`/opportunity-applications?id=${opportunityId}`);
  };

  // Load application statuses when applications change
  useEffect(() => {
    if (applications.length > 0) {
      const applicationStatuses = JSON.parse(localStorage.getItem('applicationStatuses') || '{}');
      const updatedApplications = applications.map(app => ({
        ...app,
        status: applicationStatuses[app.id] || 'pending'
      }));
      setApplications(updatedApplications);
    }
  }, [applications.length]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentUser?.name || 'Organization'} Dashboard 🏢
                </h1>
                <p className="text-gray-600 mt-2">Manage your volunteer opportunities and applications</p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button
                  onClick={() => router.push('/submit')}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Create Opportunity
                </button>
                <button
                  onClick={refreshDashboard}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </section>
       {/* My Opportunities Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Opportunities</h2>
            </div>
            
            {myOpportunities.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No opportunities yet</h3>
                <p className="text-gray-600 mb-4">Create your first volunteer opportunity to get started!</p>
                <button
                  onClick={() => router.push('/submit')}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Create Opportunity
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myOpportunities.map((opportunity) => (
                  <div 
                    key={opportunity.id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all duration-200"
                    onClick={() => handleOpportunityClick(opportunity.id)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{opportunity.title}</h3>
                          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
                            {opportunity.category}
                          </span>
                        </div>
                        <button
                          onClick={(e) => deleteOpportunity(opportunity.id, e)}
                          className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete opportunity"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">{opportunity.description}</p>
                      
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {opportunity.location}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {opportunity.date}
                        </div>
                        {opportunity.requirements && (
                          <div className="flex items-start">
                            <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {opportunity.requirements}
                          </div>
                        )}
                      </div>
                      
                      {/* Click indicator */}
                      <div className="mt-3 flex items-center justify-center">
                        <div className="flex items-center text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Click to view applications
                        </div>
                      </div>
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