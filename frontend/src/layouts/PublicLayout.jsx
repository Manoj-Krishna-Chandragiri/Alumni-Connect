import { Outlet, Link } from 'react-router-dom';
import { FiUsers, FiCalendar, FiBriefcase, FiArrowRight } from 'react-icons/fi';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://www.vvitu.ac.in/src/assets/images/VVIT_logo.png"
                alt="VVITU Logo"
                className="h-10"
              />
              <span className="font-bold text-xl text-gray-900">VVITU</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect with Your
            <span className="text-primary-600"> Alumni Network</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Bridge the gap between students and alumni. Get career guidance,
            explore opportunities, and build meaningful professional connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary py-3 px-8 text-lg">
              Join Now <FiArrowRight className="inline ml-2" />
            </Link>
            <Link to="/login" className="btn-secondary py-3 px-8 text-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why VVITU Alumni Network?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Network Building
              </h3>
              <p className="text-gray-600">
                Connect with successful alumni from your institution. Get mentorship
                and guidance for your career journey.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiBriefcase className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Job Opportunities
              </h3>
              <p className="text-gray-600">
                Access exclusive job postings and internship opportunities shared
                by alumni working in top companies.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Events & Meetups
              </h3>
              <p className="text-gray-600">
                Participate in alumni events, workshops, and networking sessions
                to expand your professional circle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-primary-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-white">10,000+</p>
              <p className="text-primary-200 mt-2">Alumni Members</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">5,000+</p>
              <p className="text-primary-200 mt-2">Active Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">500+</p>
              <p className="text-primary-200 mt-2">Companies Hiring</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">1,000+</p>
              <p className="text-primary-200 mt-2">Jobs Posted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="https://www.vvitu.ac.in/src/assets/images/VVIT_logo.png"
                  alt="VVITU Logo"
                  className="h-10"
                />
                <span className="font-bold text-xl">VVITU</span>
              </div>
              <p className="text-gray-400">
                Building bridges between past and present for a brighter future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">For Students</a></li>
                <li><a href="#" className="hover:text-white">For Alumni</a></li>
                <li><a href="#" className="hover:text-white">For Institutions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Events</a></li>
                <li><a href="#" className="hover:text-white">Career Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>alumni@vvitu.ac.in</li>
                <li>+91 866-2555530</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Vasireddy Venkatadri International Technological University. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Outlet />
    </div>
  );
};

export default PublicLayout;
