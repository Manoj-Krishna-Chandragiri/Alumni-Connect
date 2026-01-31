import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import studentApi from '../../api/student.api';
import { BlogList, BlogFilter } from '../../components/student';
import { SearchBar, Loader, ErrorAlert } from '../../components/shared';

const StudentHome = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ category: '', search: '' });

  useEffect(() => {
    fetchBlogs();
  }, [filters]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getBlogs(filters);
      setBlogs(response.data);
    } catch (err) {
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
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
          <p className="text-sm text-gray-500">Alumni Connected</p>
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
