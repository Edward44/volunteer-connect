'use client'

import { useState } from 'react';
import Image from 'next/image';
import Navbar from './components/Navbar';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Connect volunteers with 
                <span className="text-emerald-600"> meaningful causes</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Discover volunteer opportunities in your community or find dedicated volunteers for your organization's mission.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/opportunities"
                  className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl min-w-[200px]"
                >
                  Find Opportunities
                </a>
                <a
                  href="/submit"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl min-w-[200px]"
                >
                  Post Opportunities
                </a>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="/DSC_0607.avif"
                alt="Volunteers working together"
                width={1200}
                height={600}
                className="rounded-2xl shadow-2xl mx-auto"
              />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why volunteering matters</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Volunteering creates positive change for both communities and individuals
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🌍",
                  title: "Make an Impact",
                  desc: "Create lasting change in your local community and beyond",
                },
                {
                  icon: "💪",
                  title: "Build Skills",
                  desc: "Develop leadership, teamwork, and professional experience",
                },
                {
                  icon: "🤝",
                  title: "Connect",
                  desc: "Meet like-minded people and build meaningful relationships",
                },
                {
                  icon: "📊",
                  title: "Track Progress",
                  desc: "Log verified hours for school, work, or personal goals",
                },
              ].map((benefit, idx) => (
                <div key={idx} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Getting started is simple - whether you're looking to volunteer or need volunteers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: "01",
                  title: "Browse Opportunities",
                  desc: "Explore volunteer opportunities posted by local organizations that match your interests and schedule",
                },
                {
                  step: "02",
                  title: "Apply & Connect",
                  desc: "Reach out to organizations directly and get involved with causes you care about",
                },
                {
                  step: "03",
                  title: "Make a Difference",
                  desc: "Complete your volunteer work and track your impact while building valuable experience",
                },
              ].map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full text-xl font-bold mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-emerald-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to get started?</h2>
            <p className="text-xl text-emerald-100 mb-8">
              Join our community of volunteers and organizations making a difference
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup/volunteer"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl min-w-[200px]"
              >
                Sign Up as Volunteer
              </a>
              <a
                href="/signup/organization"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl min-w-[200px]"
              >
                Sign Up as Organization
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}