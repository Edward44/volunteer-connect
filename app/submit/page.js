import Navbar from '../components/Navbar';

export default function SubmitPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">Submit a Volunteering Opportunity</h1>
        <form className="space-y-4 max-w-lg">
          <input
            type="text"
            placeholder="Opportunity Title"
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="Description"
            className="w-full border p-2 rounded"
            rows={4}
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full border p-2 rounded"
          />
          <input
            type="date"
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </main>
    </>
  );
}
