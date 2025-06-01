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
        <section className="text-center px-6 py-12 bg-white shadow-sm">
          <div className="max-w-4xl mx-auto">
            <Image
              src="/DSC_0607.avif"
              alt="Volunteering together"
              width={900}
              height={500}
              className="rounded-xl shadow-md mx-auto mb-6"
            />
            <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
              Welcome to Volunteer Connect
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Discover and share meaningful volunteer opportunities in your local community.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
            <a
           href="/opportunities"
           className="text-white bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
           >
            Find Volunteering Opportunities
          </a>
           <a
        href="/submit"
        className="text-white bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
        Find Volunteers for Your Mission
        </a>
        <a
    href="/signup/volunteer"
    className="text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition font-semibold"
  >
    Sign Up as a Volunteer
  </a>
  <a
    href="/signup/organization"
    className="text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition font-semibold"
  >
    Sign Up as an Organization
  </a>
</div>


          </div>
        </section>

        {/* Why Volunteer Section */}
        <section className="px-6 py-16 bg-gray-100">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-10">Why Volunteer?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Make an Impact",
                img: "/DLXevents.avif",
                desc: "Help local causes and communities thrive.",
              },
              {
                title: "Build Skills",
                img: "/DLXevents.avif",
                desc: "Gain leadership and teamwork experience.",
              },
              {
                title: "Meet People",
                img: "/DLXevents.avif",
                desc: "Connect with like-minded volunteers.",
              },
              {
                title: "Earn Hours",
                img: "/DLXevents.avif",
                desc: "Track verified hours for school or work.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-blue-600 mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-6 py-16 bg-white">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "1. Browse",
                desc: "Search for local volunteering opportunities posted by organizations.",
                img: "/DSC_0607.avif",
              },
              {
                title: "2. Submit",
                desc: "Organizations can post events or needs for volunteers.",
                img: "/DSC_0607.avif",
              },
              {
                title: "3. Track",
                desc: "Keep a record of your hours and get verification for school or programs.",
                img: "/DSC_0607.avif",
              },
            ].map((step, idx) => (
              <div key={idx} className="bg-blue-50 p-6 rounded-lg shadow text-center">
                <Image
                  src={step.img}
                  alt={step.title}
                  width={70}
                  height={70}
                  className="mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-blue-700 mb-2">{step.title}</h3>
                <p className="text-gray-700">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
 
  );
}
