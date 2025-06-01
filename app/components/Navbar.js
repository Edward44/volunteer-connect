import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex gap-6">
      <Link href="/" className="hover:underline">Home</Link>
      <Link href="/opportunities" className="hover:underline">Find Volunteer Opportunities</Link>
      <Link href="/submit" className="hover:underline">Post a Listing</Link>
    </nav>
  );
}
