'use client';

import { useState } from 'react';

export default function OrganizationSignupPage() {
  const [formData, setFormData] = useState({
    orgName: '',
    email: '',
    location: '',
    industry: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Organization Signup:', formData);
    // Here you could send to an API or service
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Organization Sign Up</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <label className="block mb-4">
          <span className="text-gray-700">Organization Name</span>
          <input
            type="text"
            name="orgName"
            value={formData.orgName}
            onChange={handleChange}
            required
            className="mt-1 block w-full border p-2 rounded"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border p-2 rounded"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Location</span>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="mt-1 block w-full border p-2 rounded"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Industry </span>
          <textarea
            name="mission"
            value={formData.mission}
            onChange={handleChange}
            required
            className="mt-1 block w-full border p-2 rounded"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Up
        </button>
      </form>
    </main>
  );
}
