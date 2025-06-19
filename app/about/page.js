import Image from 'next/image';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="mb-8">
              <span className="text-5xl font-bold text-gray-900">
                <span className="text-emerald-600">Bono</span>
              </span>
              <p className="text-xl text-gray-600 mt-2 font-medium">
                Helping you help others
              </p>
            </div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              We believe that everyone has something valuable to contribute to their community. 
              Bono bridges the gap between passionate volunteers and meaningful opportunities, 
              making it easier than ever to create positive change.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-emerald-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                We noticed a significant gap in the volunteering ecosystem. On one side, 
                dedicated individuals wanting to make a difference struggled to find 
                meaningful opportunities that matched their skills and interests. On the other, 
                organizations desperately needed reliable volunteers but lacked effective 
                ways to reach them.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Bono was created to solve this problem by providing a streamlined platform 
                where volunteers can discover impactful opportunities and organizations can 
                connect with committed community members.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="w-full h-64 bg-emerald-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="text-emerald-600 font-semibold">Mission Placeholder</p>
                  <p className="text-gray-600 text-sm mt-2">Connecting hearts with causes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Bono?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're more than just a platform – we're a community dedicated to making volunteering accessible, 
              meaningful, and impactful for everyone involved.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Discovery</h3>
              <p className="text-gray-600">
                Find volunteer opportunities that match your interests, skills, and schedule 
                with our intuitive search and filtering system.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Reliable Connections</h3>
              <p className="text-gray-600">
                We verify organizations and provide tools to help both volunteers and 
                organizations build lasting, meaningful relationships.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real Impact</h3>
              <p className="text-gray-600">
                Track your volunteer hours, see the difference you're making, and connect 
                with causes that truly matter to you and your community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Bono was founded by a team of passionate individuals who experienced firsthand 
              the challenges of connecting volunteers with meaningful opportunities. We believe 
              that when good people come together for good causes, extraordinary things happen.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="w-full h-48 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <p className="text-emerald-600 font-semibold">Community Focus</p>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Built for Communities</h3>
              <p className="text-gray-600">
                We understand that every community has unique needs and strengths. Our platform 
                is designed to celebrate local initiatives while connecting them to broader movements.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="w-full h-48 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="text-emerald-600 font-semibold">Innovation</p>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Continuous Innovation</h3>
              <p className="text-gray-600">
                We're constantly improving our platform based on feedback from volunteers and 
                organizations, ensuring that Bono evolves with the needs of the communities we serve.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-emerald-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of volunteers and organizations who are already making an impact through Bono.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/opportunities" 
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Find Opportunities
            </Link>
            <Link 
              href="/submit" 
              className="inline-flex items-center justify-center px-8 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg border-2 border-emerald-700 hover:border-emerald-800"
            >
              Post an Opportunity
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

//filler info for now, will be easy enough to go through and change/update