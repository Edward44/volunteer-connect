'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function OpportunityApplications() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get('id');
  
  const [currentUser, setCurrentUser] = useState(null);
  const [opportunity, setOpportunity] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample opportunities data (same as organization dashboard)
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

  // Hardcoded sample volunteer applications
  const sampleApplications = {
    1: [ // Beach Cleanup applications
      {
        id: 'sample-1-1',
        volunteerId: 'sample-vol-1',
        opportunityId: 1,
        volunteerName: 'Sarah Martinez',
        volunteerEmail: 'sarah.martinez@email.com',
        volunteerPhone: '(555) 123-4567',
        volunteerBio: 'Environmental science student passionate about ocean conservation. I volunteer regularly with local environmental groups and love spending time outdoors.',
        volunteerSkills: ['Environmental Awareness', 'Team Leadership', 'Data Collection', 'Public Speaking'],
        volunteerExperience: 'Participated in 5+ beach cleanups, organized recycling drives at university, member of Environmental Club for 2 years.',
        volunteerAvailability: 'Weekends and weekday mornings',
        volunteerLocation: 'Santa Monica, CA',
        opportunityTitle: 'Beach Cleanup Volunteer',
        organization: 'Ocean Conservation Society',
        status: 'pending',
        appliedAt: '2025-06-10T10:30:00Z',
        message: 'Application for Beach Cleanup Volunteer'
      },
      {
        id: 'sample-1-2',
        volunteerId: 'sample-vol-2',
        opportunityId: 1,
        volunteerName: 'Michael Chen',
        volunteerEmail: 'michael.chen@email.com',
        volunteerPhone: '(555) 234-5678',
        volunteerBio: 'Recent graduate with a degree in Marine Biology. I believe in protecting our oceans for future generations and want to contribute to meaningful conservation efforts.',
        volunteerSkills: ['Marine Biology', 'Research', 'Photography', 'Social Media'],
        volunteerExperience: 'Completed marine biology internship, participated in underwater research projects, documented marine life for conservation databases.',
        volunteerAvailability: 'Flexible schedule, available most days',
        volunteerLocation: 'Los Angeles, CA',
        opportunityTitle: 'Beach Cleanup Volunteer',
        organization: 'Ocean Conservation Society',
        status: 'accepted',
        appliedAt: '2025-06-08T14:20:00Z',
        message: 'Application for Beach Cleanup Volunteer'
      },
      {
        id: 'sample-1-3',
        volunteerId: 'sample-vol-3',
        opportunityId: 1,
        volunteerName: 'Emma Rodriguez',
        volunteerEmail: 'emma.rodriguez@email.com',
        volunteerPhone: '(555) 345-6789',
        volunteerBio: 'High school senior planning to study environmental engineering. I want to make a positive impact on our environment and gain hands-on experience in conservation work.',
        volunteerSkills: ['Organization', 'Communication', 'Problem Solving', 'Teamwork'],
        volunteerExperience: 'Organized school environmental awareness campaigns, volunteer at local park cleanups, member of Green Club.',
        volunteerAvailability: 'Weekends and school holidays',
        volunteerLocation: 'Manhattan Beach, CA',
        opportunityTitle: 'Beach Cleanup Volunteer',
        organization: 'Ocean Conservation Society',
        status: 'pending',
        appliedAt: '2025-06-09T16:45:00Z',
        message: 'Application for Beach Cleanup Volunteer'
      }
    ],
    2: [ // Food Bank applications
      {
        id: 'sample-2-1',
        volunteerId: 'sample-vol-4',
        opportunityId: 2,
        volunteerName: 'David Thompson',
        volunteerEmail: 'david.thompson@email.com',
        volunteerPhone: '(555) 456-7890',
        volunteerBio: 'Retired teacher with 30 years of experience. I have a passion for helping others and want to give back to my community by addressing food insecurity.',
        volunteerSkills: ['Teaching', 'Organization', 'Customer Service', 'Inventory Management'],
        volunteerExperience: 'Volunteer at soup kitchen for 3 years, helped organize community food drives, experience managing classroom supplies and resources.',
        volunteerAvailability: 'Weekdays and weekends, very flexible',
        volunteerLocation: 'Downtown Los Angeles, CA',
        opportunityTitle: 'Food Bank Assistant',
        organization: 'Community Food Network',
        status: 'accepted',
        appliedAt: '2025-06-07T09:15:00Z',
        message: 'Application for Food Bank Assistant'
      },
      {
        id: 'sample-2-2',
        volunteerId: 'sample-vol-5',
        opportunityId: 2,
        volunteerName: 'Lisa Park',
        volunteerEmail: 'lisa.park@email.com',
        volunteerPhone: '(555) 567-8901',
        volunteerBio: 'Working professional who wants to volunteer during my free time. I understand the importance of food security and want to help families in need.',
        volunteerSkills: ['Project Management', 'Logistics', 'Bilingual (English/Korean)', 'Computer Skills'],
        volunteerExperience: 'Volunteer at local community center, helped coordinate charity events at work, experience in warehouse operations.',
        volunteerAvailability: 'Evenings and weekends',
        volunteerLocation: 'Koreatown, CA',
        opportunityTitle: 'Food Bank Assistant',
        organization: 'Community Food Network',
        status: 'pending',
        appliedAt: '2025-06-11T13:30:00Z',
        message: 'Application for Food Bank Assistant'
      },
      {
        id: 'sample-2-3',
        volunteerId: 'sample-vol-6',
        opportunityId: 2,
        volunteerName: 'James Wilson',
        volunteerEmail: 'james.wilson@email.com',
        volunteerPhone: '(555) 678-9012',
        volunteerBio: 'College student studying social work. I want to gain experience working with diverse communities and learn more about addressing social issues.',
        volunteerSkills: ['Social Work', 'Communication', 'Cultural Sensitivity', 'Data Entry'],
        volunteerExperience: 'Volunteer at homeless shelter, completed social work field placement, experience with community outreach programs.',
        volunteerAvailability: 'Weekends and some weekday afternoons',
        volunteerLocation: 'University Park, CA',
        opportunityTitle: 'Food Bank Assistant',
        organization: 'Community Food Network',
        status: 'rejected',
        appliedAt: '2025-06-06T11:45:00Z',
        message: 'Application for Food Bank Assistant'
      },
      {
        id: 'sample-2-4',
        volunteerId: 'sample-vol-7',
        opportunityId: 2,
        volunteerName: 'Maria Gonzalez',
        volunteerEmail: 'maria.gonzalez@email.com',
        volunteerPhone: '(555) 789-0123',
        volunteerBio: 'Mother of two who has received help from food banks in the past. I want to give back and help other families going through difficult times.',
        volunteerSkills: ['Bilingual (English/Spanish)', 'Customer Service', 'Empathy', 'Organization'],
        volunteerExperience: 'Volunteer at children\'s school events, helped organize neighborhood food drives, experience working with families in crisis.',
        volunteerAvailability: 'School hours on weekdays',
        volunteerLocation: 'East LA, CA',
        opportunityTitle: 'Food Bank Assistant',
        organization: 'Community Food Network',
        status: 'pending',
        appliedAt: '2025-06-12T08:20:00Z',
        message: 'Application for Food Bank Assistant'
      }
    ]
  };

  useEffect(() => {
    // Check if user is logged in and is an organization
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn || !user || user.userType !== 'organization') {
      router.push('/login');
      return;
    }

    if (!opportunityId) {
      router.push('/account/organization');
      return;
    }

    setCurrentUser(user);
    loadOpportunityData(user, parseInt(opportunityId));
  }, [router, opportunityId]);

  const loadOpportunityData = async (user, oppId) => {
    try {
      // Load all opportunities (sample + custom)
      const savedOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      const allOpportunities = [...sampleOpportunities, ...savedOpportunities];
      
      // Find the specific opportunity
      const targetOpportunity = allOpportunities.find(opp => opp.id === oppId);
      
      if (!targetOpportunity) {
        alert('Opportunity not found');
        router.push('/account/organization');
        return;
      }

      // For sample opportunities (id 1-4), skip permission check
      const isSampleOpportunity = oppId >= 1 && oppId <= 4;
      
      if (!isSampleOpportunity) {
        // Verify this opportunity belongs to the current organization
        const belongsToOrg = (
          targetOpportunity.organizationId === user.id ||
          targetOpportunity.organization === user.name ||
          targetOpportunity.organizationName === user.name ||
          targetOpportunity.createdBy === user.id
        );

        if (!belongsToOrg) {
          alert('You do not have permission to view this opportunity');
          router.push('/login');
          return;
        }
      }

      setOpportunity(targetOpportunity);

      // Check if this is a sample opportunity with hardcoded applications
      if (sampleApplications[oppId]) {
        // Load sample applications and merge with any stored status updates
        const applicationStatuses = JSON.parse(localStorage.getItem('applicationStatuses') || '{}');
        const applicationsWithStatus = sampleApplications[oppId].map(app => ({
          ...app,
          status: applicationStatuses[app.id] || app.status
        }));
        setApplications(applicationsWithStatus);
      } else {
        // Original logic for custom opportunities
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const volunteers = allUsers.filter(u => u.userType === 'volunteer');
        
        const oppApplications = [];
        
        volunteers.forEach(volunteer => {
          if (volunteer.appliedOpportunities && volunteer.appliedOpportunities.includes(oppId)) {
            const applicationId = `${volunteer.id}-${oppId}`;
            
            const applicationStatuses = JSON.parse(localStorage.getItem('applicationStatuses') || '{}');
            const status = applicationStatuses[applicationId] || 'pending';
            
            oppApplications.push({
              id: applicationId,
              volunteerId: volunteer.id,
              opportunityId: oppId,
              volunteerName: volunteer.name,
              volunteerEmail: volunteer.email,
              volunteerPhone: volunteer.phone || 'Not provided',
              volunteerBio: volunteer.bio || 'No bio provided',
              volunteerSkills: volunteer.skills || [],
              volunteerExperience: volunteer.experience || 'No experience listed',
              volunteerAvailability: volunteer.availability || 'Not specified',
              volunteerLocation: volunteer.location || 'Not specified',
              opportunityTitle: targetOpportunity.title,
              organization: targetOpportunity.organization,
              status: status,
              appliedAt: volunteer.appliedAt || new Date().toISOString(),
              message: `Application for ${targetOpportunity.title}`
            });
          }
        });

        setApplications(oppApplications);
      }
    } catch (error) {
      console.error('Error loading opportunity data:', error);
      alert('Error loading opportunity data');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationStatus = (applicationId, newStatus) => {
    try {
      // Update applications in state
      const updatedApplications = applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      );
      setApplications(updatedApplications);
      
      // Store application status in localStorage
      const applicationStatuses = JSON.parse(localStorage.getItem('applicationStatuses') || '{}');
      applicationStatuses[applicationId] = newStatus;
      localStorage.setItem('applicationStatuses', JSON.stringify(applicationStatuses));
      
      const action = newStatus === 'accepted' ? 'accepted' : 'rejected';
      alert(`Application ${action} successfully!`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Error updating application. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const acceptedCount = applications.filter(app => app.status === 'accepted').length;
  const pendingCount = applications.filter(app => app.status === 'pending').length;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applications...</p>
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
            <div className="flex items-center mb-4">
              <button
                onClick={() => router.push('/account/organization')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {opportunity?.title}
                </h1>
                <p className="text-gray-600 mb-4">{opportunity?.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {opportunity?.location}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {opportunity?.date}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {opportunity?.time}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 lg:mt-0 lg:ml-8">
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${
                  opportunity?.category === 'Environment' ? 'bg-green-100 text-green-800' :
                  opportunity?.category === 'Community' ? 'bg-blue-100 text-blue-800' :
                  opportunity?.category === 'Education' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {opportunity?.category}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div className="p-3 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Accepted Volunteers</p>
                    <p className="text-2xl font-bold text-gray-900">{acceptedCount}</p>
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
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Applications Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Volunteer Applications</h2>
            
            {applications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600">Applications for this opportunity will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {applications.map((application) => (
                  <div key={application.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-bold text-lg">
                              {application.volunteerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {application.volunteerName}
                            </h3>
                            <p className="text-gray-600">{application.volunteerEmail}</p>
                          </div>
                          <span className={`ml-auto px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(application.status)}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {application.volunteerEmail}
                              </div>
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {application.volunteerPhone}
                              </div>
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {application.volunteerLocation}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Availability</h4>
                            <p className="text-sm text-gray-600">{application.volunteerAvailability}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                          <p className="text-gray-600 text-sm">{application.volunteerBio}</p>
                        </div>
                        
                        {application.volunteerSkills && application.volunteerSkills.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {application.volunteerSkills.map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                          <p className="text-gray-600 text-sm">{application.volunteerExperience}</p>
                        </div>
                      </div>
                      
                      {application.status === 'pending' && (
                        <div className="mt-6 lg:mt-0 lg:ml-6 flex space-x-3">
                          <button
                            onClick={() => handleApplicationStatus(application.id, 'accepted')}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleApplicationStatus(application.id, 'rejected')}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-500">
                        Applied on {new Date(application.appliedAt).toLocaleDateString()}
                      </span>
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