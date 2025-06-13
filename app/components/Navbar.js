'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setShowDropdown(false);
    window.location.href = '/';
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            <span className="text-emerald-600">Bono</span>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
            Home
          </Link>
          <Link href="/opportunities" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
            Opportunities
          </Link>
          <Link href="/submit" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
            Post Listing
          </Link>
          {currentUser && (
            <Link href="/account" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
              My Account
            </Link>
          )}
        </div>
        
        {/* Login/Account Button */}
        <div className="flex items-center">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {currentUser.userType === 'organization' 
                      ? currentUser.orgName?.charAt(0).toUpperCase() || 'O'
                      : currentUser.name?.charAt(0).toUpperCase() || 'U'
                    }
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  {currentUser.userType === 'organization' ? currentUser.orgName : currentUser.name}
                </span>
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link 
                    href="/account" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Account
                    </div>
                  </Link>
                  
                  {currentUser.userType === 'volunteer' && (
                    <Link 
                      href="/dashboard/volunteer" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Dashboard
                      </div>
                    </Link>
                  )}
                  
                  {currentUser.userType === 'organization' && (
                    <Link 
                      href="/dashboard/organization" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Dashboard
                      </div>
                    </Link>
                  )}
                  
                  <hr className="my-2" />
                  
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden mt-4 flex flex-col space-y-2">
        <Link href="/" className="text-gray-700 hover:text-emerald-600 font-medium py-2">
          Home
        </Link>
        <Link href="/opportunities" className="text-gray-700 hover:text-emerald-600 font-medium py-2">
          Opportunities
        </Link>
        <Link href="/submit" className="text-gray-700 hover:text-emerald-600 font-medium py-2">
          Post Listing
        </Link>
        {currentUser && (
          <>
            <Link href="/account" className="text-gray-700 hover:text-emerald-600 font-medium py-2">
              My Account
            </Link>
            <Link 
              href={currentUser.userType === 'volunteer' ? '/dashboard/volunteer' : '/dashboard/organization'} 
              className="text-gray-700 hover:text-emerald-600 font-medium py-2"
            >
              Dashboard
            </Link>
            <button 
              onClick={handleLogout}
              className="text-left text-red-600 hover:text-red-700 font-medium py-2"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}