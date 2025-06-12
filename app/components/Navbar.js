import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Volunteer<span className="text-emerald-600">Connect</span>
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
        </div>
        
        {/* Login Button */}
        <div className="flex items-center">
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Login
          </Link>
        </div>
      </div>
      
      {/* Mobile Navigation - could be expanded later */}
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
      </div>
    </nav>
  );
}