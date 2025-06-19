'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function MyAccountPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [userOpportunities, setUserOpportunities] = useState([]);
  const [appliedOpportunities, setAppliedOpportunities] = useState([]);

  useEffect(() => {
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    // Load user's data based on user type
    if (user.userType === 'organization') {
      loadOrganizationData(user);
    } else {
      loadVolunteerData(user);
    }
  }, [router]);

  const loadOrganizationData = (user) => {
    // Get all opportunities and filter by organization
    const allOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
    const userPostedOpportunities = allOpportunities.filter(opp => 
      opp.organization === user.orgName
    );
    setUserOpportunities(userPostedOpportunities);
  };

  const loadVolunteerData = (user) => {
    // Get volunteer's applied opportunities
    const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
    const currentVolunteer = volunteers.find(vol => vol.id === user.id);
    
    if (currentVolunteer && currentVolunteer.appliedOpportunities) {
      const allOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      const applied = allOpportunities.filter(opp => 
        currentVolunteer.appliedOpportunities.includes(opp.id)
      );
      setAppliedOpportunities(applied);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  const deleteOpportunity = (opportunityId) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      const allOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      const updatedOpportunities = allOpportunities.filter(opp => opp.id !== opportunityId);
      localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities));
      
      // Update local state
      setUserOpportunities(prev => prev.filter(opp => opp.id !== opportunityId));
    }
  };

  const withdrawFromOpportunity = (opportunityId) => {
    if (confirm('Are you sure you want to withdraw from this opportunity?')) {
      // Update volunteer's applied opportunities
      const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
      const updatedVolunteers = volunteers.map(vol => {
        if (vol.id === currentUser.id) {
          return {
            ...vol,
            appliedOpportunities: vol.appliedOpportunities?.filter(id => id !== opportunityId) || []
          };
        }
        return vol;
      });
      localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
      
      // Update current user in localStorage
      const updatedUser = {
        ...currentUser,
        appliedOpportunities: currentUser.appliedOpportunities?.filter(id => id !== opportunityId) || []
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      // Update local state
      setAppliedOpportunities(prev => prev.filter(opp => opp.id !== opportunityId));
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Environment: 'bg-green-100 text-green-800',
      Community: 'bg-blue-100 text-blue-800',
      Education: 'bg-purple-100 text-purple-800',
      Healthcare: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-600 mt-1">
                  Welcome back, {currentUser.userType === 'organization' ? currentUser.orgName : currentUser.name}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Tab Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              {currentUser.userType === 'organization' ? (
                <button
                  onClick={() => setActiveTab('posted')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'posted'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Posted Opportunities ({userOpportunities.length})
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('applied')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'applied'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Applied Opportunities ({appliedOpportunities.length})
                </button>
              )}
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-emerald-100 rounded-lg">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Account Type</p>
                      <p className="text-2xl font-bold text-gray-900 capitalize">{currentUser.userType}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        {currentUser.userType === 'organization' ? 'Posted' : 'Applied'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {currentUser.userType === 'organization' ? userOpportunities.length : appliedOpportunities.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M3 13a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4H7a4 4 0 01-4-4v-6z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Member Since</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {new Date(currentUser.dateRegistered).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {currentUser.userType === 'organization' ? (
                    userOpportunities.length > 0 ? (
                      userOpportunities.slice(0, 3).map(opp => (
                        <div key={opp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{opp.title}</p>
                            <p className="text-sm text-gray-600">{opp.date} • {opp.volunteers}/{opp.maxVolunteers} volunteers</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(opp.category)}`}>
                            {opp.category}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No opportunities posted yet.</p>
                    )
                  ) : (
                    appliedOpportunities.length > 0 ? (
                      appliedOpportunities.slice(0, 3).map(opp => (
                        <div key={opp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{opp.title}</p>
                            <p className="text-sm text-gray-600">{opp.organization} • {opp.date}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(opp.category)}`}>
                            {opp.category}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No opportunities applied to yet.</p>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Posted Opportunities Tab (Organizations) */}
          {activeTab === 'posted' && currentUser.userType === 'organization' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Your Posted Opportunities</h3>
                <button
                  onClick={() => router.push('/submit')}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Post New Opportunity
                </button>
              </div>

              {userOpportunities.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {userOpportunities.map(opportunity => (
                    <div key={opportunity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(opportunity.category)}`}>
                          {opportunity.category}
                        </span>
                      </div>
                      
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{opportunity.title}</h4>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {opportunity.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M3 13a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4H7a4 4 0 01-4-4v-6z" />
                          </svg>
                          {opportunity.date}
                        </div>
                      </div>

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

                      <button
                        onClick={() => deleteOpportunity(opportunity.id)}
                        className="w-full bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Delete Opportunity
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No opportunities posted yet</h3>
                  <p className="text-gray-600 mb-4">Start making a difference by posting your first volunteer opportunity</p>
                  <button
                    onClick={() => router.push('/submit')}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Post Your First Opportunity
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Applied Opportunities Tab (Volunteers) */}
          {activeTab === 'applied' && currentUser.userType === 'volunteer' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Your Applied Opportunities</h3>
                <button
                  onClick={() => router.push('/opportunities')}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Find More Opportunities
                </button>
              </div>

              {appliedOpportunities.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {appliedOpportunities.map(opportunity => (
                    <div key={opportunity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(opportunity.category)}`}>
                          {opportunity.category}
                        </span>
                      </div>
                      
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{opportunity.title}</h4>
                      <p className="text-emerald-600 font-medium mb-4">{opportunity.organization}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {opportunity.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M3 13a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4H7a4 4 0 01-4-4v-6z" />
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

                      <button
                        onClick={() => withdrawFromOpportunity(opportunity.id)}
                        className="w-full bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Withdraw Application
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600 mb-4">Start making a difference by applying to volunteer opportunities</p>
                  <button
                    onClick={() => router.push('/opportunities')}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Find Opportunities
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentUser.userType === 'organization' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                      <p className="text-gray-900">{currentUser.orgName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <p className="text-gray-900">{currentUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <p className="text-gray-900">{currentUser.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <p className="text-gray-900">{currentUser.website || 'Not provided'}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Industry/Mission</label>
                      <p className="text-gray-900">{currentUser.industry}</p>
                    </div>
                    {currentUser.description && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <p className="text-gray-900">{currentUser.description}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <p className="text-gray-900">{currentUser.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <p className="text-gray-900">{currentUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <p className="text-gray-900">{currentUser.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <p className="text-gray-900">{currentUser.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                      <p className="text-gray-900 capitalize">{currentUser.availability || 'Not specified'}</p>
                    </div>
                    {currentUser.interests && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Interests & Skills</label>
                        <p className="text-gray-900">{currentUser.interests}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}