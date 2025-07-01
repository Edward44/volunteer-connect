'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function VolunteerDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample opportunities data (same as opportunities page)
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
    loadDashboardData(user);
  }, [router]);

  const loadDashboardData = (user) => {
    try {
      // Load all opportunities (sample + custom)
      const savedOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      const allOpportunities = [...sampleOpportunities, ...savedOpportunities];
      setOpportunities(allOpportunities.slice(0, 6)); // Show first 6 opportunities

      // Get user's applied opportunities from their profile
      const appliedOpportunityIds = user.appliedOpportunities || [];
      
      // Create application objects for each applied opportunity
      const userApplications = appliedOpportunityIds.map(opportunityId => {
        const opportunity = allOpportunities.find(opp => opp.id === opportunityId);
        return {
          id: opportunityId,
          volunteerId: user.id,
          opportunityId: opportunityId,
          status: 'pending', // Default status
          appliedAt: new Date().toISOString(), // You might want to track this better
          volunteerName: user.name,
          volunteerEmail: user.email,
          opportunityTitle: opportunity?.title || 'Unknown Opportunity',
          organization: opportunity?.organization || 'Unknown Organization'
        };
      });

      setMyApplications(userApplications);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  const applyToOpportunity = (opportunityId) => {
    if (!currentUser) return;

    try {
      // Check if already applied
      if (currentUser.appliedOpportunities && currentUser.appliedOpportunities.includes(opportunityId)) {
        alert('You have already applied to this opportunity!');
        return;
      }

      // Update user's applied opportunities
      const updatedUser = {
        ...currentUser,
        appliedOpportunities: [...(currentUser.appliedOpportunities || []), opportunityId]
      };

      // Save updated user to localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      // Update all users in localStorage
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = allUsers.map(user => 
        user.id === currentUser.id ? updatedUser : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Refresh dashboard data
      loadDashboardData(updatedUser);
      
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying to opportunity:', error);
      alert('Error submitting application. Please try again.');
    }
  };

  const isAlreadyApplied = (opportunityId) => {
    return currentUser?.appliedOpportunities?.includes(opportunityId) || false;
  };

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
                  Welcome back, {currentUser?.name || 'Volunteer'}! 🤝
                </h1>
                <p className="text-gray-600 mt-2">Ready to make a difference today?</p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button
                  onClick={() => router.push('/opportunities')}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Browse All Opportunities
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

        {/* Dashboard Stats */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/applications')}
                className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow text-center w-full max-w-md"
              >
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-emerald-100 rounded-lg mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Application Details</h3>
                    <p className="text-gray-600 mb-4">View and manage your volunteer applications</p>
                    <div className="flex items-center justify-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">{myApplications.length}</p>
                        <p className="text-gray-500">Total</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                          {myApplications.filter(app => app.status === 'pending').length}
                        </p>
                        <p className="text-gray-500">Pending</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {myApplications.filter(app => app.status === 'accepted').length}
                        </p>
                        <p className="text-gray-500">Accepted</p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Recent Opportunities */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Opportunities</h2>
              <button
                onClick={() => router.push('/opportunities')}
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                View All →
              </button>
            </div>

            {opportunities.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No opportunities available yet</h3>
                <p className="text-gray-600 mb-6">Check back soon for new volunteer opportunities!</p>
                <button
                  onClick={() => router.push('/opportunities')}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Browse Opportunities
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{opportunity.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{opportunity.organization}</p>
                        <p className="text-sm text-gray-500">{opportunity.location}</p>
                      </div>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                        {opportunity.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {opportunity.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {opportunity.date}
                      </span>
                      {isAlreadyApplied(opportunity.id) ? (
                        <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                          Applied ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => applyToOpportunity(opportunity.id)}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* My Applications */}
        {myApplications.length > 0 && (
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h2>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Opportunity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {myApplications.map((application) => (
                        <tr key={application.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {application.opportunityTitle}
                              </div>
                              <div className="text-sm text-gray-500">
                                {application.organization}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(application.appliedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              application.status === 'accepted' 
                                ? 'bg-green-100 text-green-800'
                                : application.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </section>
        )}
      </main>
    </>
  );
}