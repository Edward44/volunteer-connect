import Navbar from '../components/Navbar';

export default function OpportunitiesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">Volunteer Opportunities</h1>
        <ul className="space-y-4">
          <li className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">Local Park Cleanup</h2>
            <p className="text-gray-700">Join us to help clean up the neighborhood park this Saturday at 10am.</p>
          </li>
          <li className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">Food Bank Helper</h2>
            <p className="text-gray-700">Help sort and distribute food items every Tuesday and Thursday.</p>
          </li>
        </ul>
      </main>
    </>
  );
}
