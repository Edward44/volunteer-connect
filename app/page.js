'use client'

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [showSignUpOptions, setShowSignUpOptions] = useState(false);

  const handleSignUp = (type) => {
    alert(`Signing up as ${type}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <Image
        src="/DSC_0607.avif"
        alt="Your Logo"
        width={400}
        height={400}
        className="mb-6 rounded-full"
      />
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          Connect with Local Volunteer Opportunities
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          A better way for students and schools to discover, track, and verify community service hours.
        </p>
        
        {/* Join Our Pilot Button */}
        {!showSignUpOptions && (
          <a
            href="#"
            onClick={() => setShowSignUpOptions(true)}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
          >
            Join Our Pilot
          </a>
        )}
        
        {/* Sign Up Options */}
        {showSignUpOptions && (
          <div className="mt-6">
            <button
              onClick={() => handleSignUp('volunteer')}
              className="inline-block w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow mb-4"
            >
              Volunteer
            </button>
            <button
              onClick={() => handleSignUp('organization')}
              className="inline-block w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
            >
              Organization
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
