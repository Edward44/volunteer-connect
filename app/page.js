import Image from 'next/image';

export default function Home() {
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
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdg4hzAMflVj66gTZXXkqlHkh51i8G4Ft-u1NPMjsKmF243dg/viewform?usp=header"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
        >
          Join Our Pilot
        </a>
      </div>
    </main>
  );
}

