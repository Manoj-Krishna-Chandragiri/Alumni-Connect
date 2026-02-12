import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import studentApi from '../../api/student.api';
import { BlogList, BlogFilter, SuggestedAlumniCard } from '../../components/student';
import { SearchBar, Loader, ErrorAlert } from '../../components/shared';
import { FiTrendingUp } from 'react-icons/fi';

const StudentHome = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [recommendedAlumni, setRecommendedAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAlumni, setLoadingAlumni] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ category: '', search: '' });

  useEffect(() => {
    fetchBlogs();
    fetchRecommendedAlumni();
  }, [filters]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getBlogs(filters);
      // Backend returns paginated data: {results: [], count: X, page: Y}
      setBlogs(Array.isArray(response.data) ? response.data : response.data.results || []);
    } catch (err) {
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedAlumni = async () => {
    try {
      setLoadingAlumni(true);
      const response = await studentApi.getRecommendedAlumni();
      console.log('API Response for recommended alumni:', response);
      console.log('Response data:', response.data);
      
      // Backend returns paginated data: {results: [], count: X, page: Y}
      const alumniData = Array.isArray(response.data) ? response.data : response.data.results || [];
      console.log('Processed alumni data:', alumniData);
      
      setRecommendedAlumni(alumniData);
    } catch (err) {
      console.error('Failed to load alumni recommendations:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoadingAlumni(false);
    }
  };

  const handleReadBlog = (blog) => {
    // Navigate to blog detail or open modal
    console.log('Read blog:', blog);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-primary-100">
          Explore the latest insights, stories, and advice from our alumni network.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-primary-600">150+</p>
          <p className="text-sm text-gray-500">Alumni Network</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">25</p>
          <p className="text-sm text-gray-500">Active Jobs</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-purple-600">8</p>
          <p className="text-sm text-gray-500">Upcoming Events</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-orange-600">95%</p>
          <p className="text-sm text-gray-500">Career Match</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="max-w-md">
          <SearchBar
            value={filters.search}
            onChange={(value) => setFilters({ ...filters, search: value })}
            placeholder="Search blogs..."
          />
        </div>
        <BlogFilter filters={filters} onChange={setFilters} />
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Recommended Alumni Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Suggested Alumni Mentors for You
          </h2>
        </div>
        {loadingAlumni ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-20 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : recommendedAlumni.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedAlumni.slice(0, 3).map((alumni, index) => (
              <SuggestedAlumniCard
                key={alumni.id || index}
                alumni={alumni}
                matchReason={alumni.matchReason}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No alumni recommendations available at the moment.</p>
            <p className="text-sm mt-2">Check back later for personalized mentor suggestions.</p>
          </div>
        )}
      </div>

      {/* Blog List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Latest from Alumni
        </h2>
        <BlogList blogs={blogs} onRead={handleReadBlog} loading={loading} />
      </div>
    </div>
  );
};

export default StudentHome;
