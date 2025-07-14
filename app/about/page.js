import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="mb-8">
              <span className="text-5xl font-bold text-gray-900">
                <span className="text-emerald-600">Bono</span>
              </span>
              <p className="text-2xl text-gray-700 mt-3 font-medium italic">
                "*Helping You Help Others*"
              </p>
            </div>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
              Empowering students to discover meaningful volunteer opportunities and 
              make a lasting impact in their communities. From service-learning requirements 
              to personal passion projects, we connect young changemakers with causes that matter.
            </p>
            <div className="bg-white rounded-lg shadow-sm border border-emerald-200 p-6 max-w-2xl mx-auto">
              <p className="text-emerald-700 font-semibold text-lg">
                🎓 Designed for Students, Built for Impact
              </p>
              <p className="text-gray-600 mt-2">
                Perfect for high school service hours, college applications, and building lifelong habits of giving back
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <div className="space-y-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  We believe every student has the power to create positive change. Whether you're 
                  fulfilling service-learning requirements, building your college resume, or simply 
                  following your passion to help others, finding the right volunteer opportunity 
                  shouldn't be complicated.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  <strong>Bono bridges the gap</strong> between motivated students and meaningful 
                  volunteer opportunities, making it effortless for schools to support their students' 
                  community engagement goals while helping nonprofits connect with the next generation 
                  of volunteers.
                </p>
                <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-600">
                  <p className="text-emerald-800 font-semibold">
                    "When students engage with their communities early, they develop into lifelong 
                    contributors who understand the power of service."
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl p-8 shadow-sm">
              <div className="text-center">
                <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-emerald-800 mb-3">Student-Centered Design</h3>
                <p className="text-emerald-700 text-lg">
                  Built specifically for the unique needs of student volunteers and educational institutions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Schools Choose Bono</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We understand the unique challenges schools face in supporting student volunteer programs. 
              Our platform makes community service accessible, trackable, and meaningful.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white text-center p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Academic Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                Seamlessly integrate volunteer opportunities with service-learning curricula, 
                graduation requirements, and honor society commitments.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white text-center p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Tracking & Reporting</h3>
              <p className="text-gray-600 leading-relaxed">
                Automated hour tracking, progress monitoring, and comprehensive reporting 
                tools that make managing student volunteer programs effortless.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white text-center p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Verified Opportunities</h3>
              <p className="text-gray-600 leading-relaxed">
                Pre-screened, student-appropriate volunteer opportunities with trusted 
                local organizations, ensuring safe and meaningful experiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Three-Way Impact Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">A Platform Built for Everyone</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just about fulfilling requirements – we're about creating meaningful connections 
              between students, schools, and organizations to build stronger communities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-8 shadow-sm border border-emerald-200">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-emerald-800">For Students</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Discover opportunities that match your interests and schedule</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Build college applications with meaningful service experiences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Track hours automatically for graduation requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Connect with like-minded peers who share your passion for service</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 shadow-sm border border-blue-200">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-800">For Schools</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  <span>Streamline service-learning program administration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  <span>Access comprehensive reporting for district requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  <span>Strengthen community partnerships through verified organizations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  <span>Enhance student engagement with meaningful volunteer experiences</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-8 shadow-sm border border-purple-200">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-purple-800">For Organizations</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">•</span>
                  <span>Connect with motivated, pre-screened student volunteers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">•</span>
                  <span>Post opportunities with specific skills and scheduling needs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">•</span>
                  <span>Access reliable volunteer tracking and verification tools</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">•</span>
                  <span>Build long-term partnerships with local schools and students</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Benefits Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Organizations Love Bono</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Partner with us to access a pipeline of enthusiastic, committed student volunteers 
              who are ready to make a real difference in your mission.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">The Challenge Organizations Face</h3>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  Many nonprofits struggle with inconsistent volunteer turnout, lack of specialized skills, 
                  and the administrative burden of managing volunteer programs. Traditional volunteer 
                  recruitment often results in one-time helpers rather than committed team members.
                </p>
                <p className="text-lg">
                  <strong>Student volunteers are different.</strong> They're motivated by learning, 
                  growth, and genuine impact. They bring fresh perspectives, digital skills, and 
                  sustained commitment when properly matched with meaningful opportunities.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-6">What Makes Bono Different</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Pre-Screened Volunteers</h5>
                    <p className="text-gray-600">Students come through verified school programs with accountability</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Skill-Based Matching</h5>
                    <p className="text-gray-600">Find students with specific skills your organization needs</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Simplified Management</h5>
                    <p className="text-gray-600">Automated tracking reduces your administrative workload</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Find Your Next Great Volunteers?</h3>
            <p className="text-purple-100 mb-6 text-lg">
              Join hundreds of organizations already using Bono to connect with passionate student volunteers.
            </p>
            <Link 
              href="/organizations" 
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Learn More for Organizations
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your School's Community Service Program?</h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Join the growing number of schools using Bono to connect students with meaningful 
            volunteer opportunities and build stronger communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/opportunities" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
            >
              Explore Opportunities
            </Link>
            <Link 
              href="/submit" 
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-900 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-emerald-800 hover:border-emerald-900 text-lg"
            >
              Partner with Us
            </Link>
          </div>
          <p className="text-emerald-200 mt-6 text-sm">
            Contact us for school district pricing and implementation support
          </p>
        </div>
      </div>
    </div>
  );
}