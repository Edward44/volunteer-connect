'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load opportunities when component mounts
  useEffect(() => {
    const loadOpportunities = () => {
      try {
        const stored = localStorage.getItem('volunteerOpportunities');
        if (stored) {
          const parsedOpportunities = JSON.parse(stored);
          // Sort by date posted (newest first)
          const sortedOpportunities = parsedOpportunities.sort((a, b) => 
            new Date(b.datePosted) - new Date(a.datePosted)
          );
          setOpportunities(sortedOpportunities);
        }
      } catch (error) {
        console.error('Error loading opportunities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOpportunities();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format posted date
  const formatPostedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  // Delete opportunity function
  const deleteOpportunity = (opportunityId) => {
    // Ask for confirmation
    if (window.confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
      try {
        // Get current opportunities
        const currentOpportunities = JSON.parse(localStorage.getItem('volunteerOpportunities') || '[]');
        
        // Filter out the opportunity to delete
        const updatedOpportunities = currentOpportunities.filter(opp => opp.id !== opportunityId);
        
        // Save back to storage
        localStorage.setItem('volunteerOpportunities', JSON.stringify(updatedOpportunities));
        
        // Update the state to refresh the page
        setOpportunities(updatedOpportunities);
        
        // Optional: Show success message
        alert('Opportunity deleted successfully!');
      } catch (error) {
        console.error('Error deleting opportunity:', error);
        alert('Error deleting opportunity. Please try again.');
      }
    }
  };

  // Clear all opportunities (for testing/admin purposes)
  const clearAllOpportunities = () => {
    if (window.confirm('Are you sure you want to delete ALL opportunities? This cannot be undone!')) {
      localStorage.removeItem('volunteerOpportunities');
      setOpportunities([]);
      alert('All opportunities cleared!');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen p-8">
          <div className="text-center">Loading opportunities...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Volunteer Opportunities</h1>
            <div className="flex items-center gap-4">
              <div className="text-gray-600">
                {opportunities.length} opportunities available
              </div>
              {opportunities.length > 0 && (
                <button
                  onClick={clearAllOpportunities}
                  className="text-red-500 hover:text-red-700 text-sm underline"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {opportunities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                No opportunities posted yet.
              </div>
              <p className="text-gray-400 mb-6">
                Be the first organization to post a volunteer opportunity!
              </p>
              <a
                href="/submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Post an Opportunity
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {opportunities.map((opportunity) => (
                <div key={opportunity.id} className="bg-white p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-xl font-semibold text-blue-700 mb-1">
                        {opportunity.title}
                      </h2>
                      <p className="text-gray-600 font-medium">
                        {opportunity.organization}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {formatPostedDate(opportunity.datePosted)}
                      </span>
                      <button
                        onClick={() => deleteOpportunity(opportunity.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                        title="Delete opportunity"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {opportunity.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">📍 Location:</span>
                      {opportunity.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">📅 Date & Time:</span>
                      {formatDate(opportunity.date)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Contact: {opportunity.contactEmail}
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium">
                      Apply to Volunteer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}