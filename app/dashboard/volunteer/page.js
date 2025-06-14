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

  useEffect(() => {
    // Check if user is logged in and is a volunteer
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn || !user || user.userType !== 'volunteer') {
      router.push('/login');
      return;
    }

    setCurrentUser(user);
    loadDashboardData();
  }, [router]);

  const loadDashboardData = () => {
    try {
      // Load available opportunities
      const allOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      setOpportunities(allOpportunities.slice(0, 6)); // Show first 6 opportunities

      // Load user's applications
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      const userApplications = applications.filter(app => app.volunteerId === currentUser?.id);
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
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      const newApplication = {
        id: Date.now(),
        volunteerId: currentUser.id,
        opportunityId: opportunityId,
        status: 'pending',
        appliedAt: new Date().toISOString(),
        volunteerName: currentUser.name,
        volunteerEmail: currentUser.email
      };

      applications.push(newApplication);
      localStorage.setItem('applications', JSON.stringify(applications));
      
      // Refresh applications
      loadDashboardData();
      
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying to opportunity:', error);
      alert('Error submitting application. Please try again.');
    }
  };

  const isAlreadyApplied = (opportunityId) => {
    return myApplications.some(app => app.opportunityId === opportunityId);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Applications Submitted</p>
                    <p className="text-2xl font-bold text-gray-900">{myApplications.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {myApplications.filter(app => app.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Accepted Applications</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {myApplications.filter(app => app.status === 'accepted').length}
                    </p>
                  </div>
                </div>
              </div>
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
                      {myApplications.map((application) => {
                        const opportunity = opportunities.find(opp => opp.id === application.opportunityId);
                        return (
                          <tr key={application.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {opportunity?.title || 'Unknown Opportunity'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {opportunity?.organization || 'Unknown Organization'}
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
                        );
                      })}
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

//volunteer dashboard needs some work, will re-code this later
//example, it doesn't count applications submitted and doesn't track opportunities in your account on your dashboard