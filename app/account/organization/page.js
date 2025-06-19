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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    category: 'Community Service',
    requirements: ''
  });

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
      // Load organization's opportunities
      const allOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      const orgOpportunities = allOpportunities.filter(opp => opp.organizationId === user.id);
      setMyOpportunities(orgOpportunities);

      // Load applications for organization's opportunities
      const allApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      const orgApplications = allApplications.filter(app => 
        orgOpportunities.some(opp => opp.id === app.opportunityId)
      );
      setApplications(orgApplications);
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

  const handleCreateOpportunity = (e) => {
    e.preventDefault();
    
    if (!currentUser) return;

    try {
      const opportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      const opportunity = {
        id: Date.now(),
        ...newOpportunity,
        organizationId: currentUser.id,
        organization: currentUser.name,
        createdAt: new Date().toISOString(),
        applicants: 0
      };

      opportunities.push(opportunity);
      localStorage.setItem('opportunities', JSON.stringify(opportunities));
      
      // Reset form and refresh data
      setNewOpportunity({
        title: '',
        description: '',
        location: '',
        date: '',
        category: 'Community Service',
        requirements: ''
      });
      setShowCreateForm(false);
      loadDashboardData(currentUser);
      
      alert('Opportunity created successfully!');
    } catch (error) {
      console.error('Error creating opportunity:', error);
      alert('Error creating opportunity. Please try again.');
    }
  };

  const handleApplicationStatus = (applicationId, newStatus) => {
    try {
      const allApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      const updatedApplications = allApplications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      );
      
      localStorage.setItem('applications', JSON.stringify(updatedApplications));
      loadDashboardData(currentUser);
      
      alert(`Application ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Error updating application. Please try again.');
    }
  };

  const deleteOpportunity = (opportunityId) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      const opportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      const updatedOpportunities = opportunities.filter(opp => opp.id !== opportunityId);
      localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities));
      
      // Also remove related applications
      const allApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      const updatedApplications = allApplications.filter(app => app.opportunityId !== opportunityId);
      localStorage.setItem('applications', JSON.stringify(updatedApplications));
      
      loadDashboardData(currentUser);
      alert('Opportunity deleted successfully!');
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      alert('Error deleting opportunity. Please try again.');
    }
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
                  {currentUser?.name || 'Organization'} Dashboard 🏢
                </h1>
                <p className="text-gray-600 mt-2">Manage your volunteer opportunities and applications</p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Create Opportunity
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Opportunities</p>
                    <p className="text-2xl font-bold text-gray-900">{myOpportunities.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.filter(app => app.status === 'pending').length}
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
                    <p className="text-sm font-medium text-gray-600">Approved Applications</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.filter(app => app.status === 'accepted').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Create Opportunity Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Opportunity</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleCreateOpportunity} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Opportunity Title
                    </label>
                    <input
                      type="text"
                      value={newOpportunity.title}
                      onChange={(e) => setNewOpportunity({...newOpportunity, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g., Community Garden Cleanup"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newOpportunity.description}
                      onChange={(e) => setNewOpportunity({...newOpportunity, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Describe the volunteer opportunity..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={newOpportunity.location}
                        onChange={(e) => setNewOpportunity({...newOpportunity, location: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g., Central Park, NYC"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Date & Time
                      </label>
                      <input
                        type="text"
                        value={newOpportunity.date}
                        onChange={(e) => setNewOpportunity({...newOpportunity, date: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g., Saturday, Dec 15, 2024 at 9:00 AM"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Category
                      </label>
                      <select
                        value={newOpportunity.category}
                        onChange={(e) => setNewOpportunity({...newOpportunity, category: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="Community Service">Community Service</option>
                        <option value="Education">Education</option>
                        <option value="Environment">Environment</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Animal Welfare">Animal Welfare</option>
                        <option value="Disaster Relief">Disaster Relief</option>
                        <option value="Youth Development">Youth Development</option>
                        <option value="Senior Care">Senior Care</option>
                        <option value="Arts & Culture">Arts & Culture</option>
                        <option value="Food & Hunger">Food & Hunger</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Requirements
                      </label>
                      <input
                        type="text"
                        value={newOpportunity.requirements}
                        onChange={(e) => setNewOpportunity({...newOpportunity, requirements: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g., Must be 16+, comfortable outdoors"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      Create Opportunity
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* My Opportunities Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Opportunities</h2>
            
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
                  onClick={() => setShowCreateForm(true)}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Create Opportunity
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{opportunity.title}</h3>
                          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
                            {opportunity.category}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteOpportunity(opportunity.id)}
                          className="text-red-400 hover:text-red-600 p-2"
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
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {applications.filter(app => app.opportunityId === opportunity.id).length} applications
                          </span>
                          <span className="text-sm text-gray-500">
                            Created {new Date(opportunity.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Applications Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Applications</h2>
            
            {applications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600">Applications for your opportunities will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => {
                  const opportunity = myOpportunities.find(opp => opp.id === application.opportunityId);
                  return (
                    <div key={application.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 mr-3">
                              {application.volunteerName}
                            </h3>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                              application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {application.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            Applied for: <span className="font-medium">{opportunity?.title}</span>
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {application.volunteerEmail}
                          </div>
                          <p className="text-gray-700 text-sm">{application.message}</p>
                        </div>
                        
                        {application.status === 'pending' && (
                          <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-3">
                            <button
                              onClick={() => handleApplicationStatus(application.id, 'accepted')}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleApplicationStatus(application.id, 'rejected')}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="text-sm text-gray-500">
                          Applied on {new Date(application.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}