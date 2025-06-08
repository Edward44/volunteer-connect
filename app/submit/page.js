'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function SubmitPage() {
  // State to hold form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    contactEmail: '',
    organization: ''
  });

  // State for showing success message
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new opportunity object with a unique ID
    const newOpportunity = {
      id: Date.now(), // Simple ID using timestamp
      ...formData,
      datePosted: new Date().toISOString()
    };

    // Get existing opportunities from browser storage
    const existingOpportunities = JSON.parse(localStorage.getItem('volunteerOpportunities') || '[]');
    
    // Add the new opportunity
    const updatedOpportunities = [...existingOpportunities, newOpportunity];
    
    // Save back to storage
    localStorage.setItem('volunteerOpportunities', JSON.stringify(updatedOpportunities));
    
    // Show success message
    setShowSuccess(true);
    
    // Clear the form
    setFormData({
      title: '',
      description: '', 
      location: '',
      date: '',
      contactEmail: '',
      organization: ''
    });

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">Submit a Volunteering Opportunity</h1>
        
        {/* Success message */}
        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Opportunity posted successfully! It will now appear on the opportunities page.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Organization Name</label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Your organization name"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Opportunity Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Local Park Cleanup"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what volunteers will be doing..."
              className="w-full border p-2 rounded"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Central Park, New York"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Date & Time</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="contact@yourorganization.org"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-semibold"
          >
            Post Opportunity
          </button>
        </form>
      </main>
    </>
  );
}