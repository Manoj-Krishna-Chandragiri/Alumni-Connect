import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import alumniApi from '../../api/alumni.api';
import { BlogList } from '../../components/student';
import { Loader, ErrorAlert, StatsCard } from '../../components/shared';
import { FiBriefcase, FiFileText, FiUsers, FiCalendar } from 'react-icons/fi';

const AlumniHome = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await alumniApi.getBlogs();
      setBlogs(response.data);
    } catch (err) {
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-primary-100">
          Share your knowledge and help shape the careers of future graduates.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Jobs Posted"
          value="12"
          icon={FiBriefcase}
          color="blue"
        />
        <StatsCard
          title="Blogs Written"
          value="8"
          icon={FiFileText}
          color="green"
        />
        <StatsCard
          title="Students Helped"
          value="45"
          icon={FiUsers}
          color="purple"
        />
        <StatsCard
          title="Events Attended"
          value="6"
          icon={FiCalendar}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-hover cursor-pointer" onClick={() => window.location.href = '/alumni/jobs'}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiBriefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Post a Job</h3>
              <p className="text-sm text-gray-500">
                Help students find opportunities at your company
              </p>
            </div>
          </div>
        </div>

        <div className="card-hover cursor-pointer" onClick={() => window.location.href = '/alumni/blogs'}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiFileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Write a Blog</h3>
              <p className="text-sm text-gray-500">
                Share your insights and career advice
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Recent Blogs */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Latest from the Community
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : (
          <BlogList blogs={blogs.slice(0, 6)} />
        )}
      </div>
    </div>
  );
};

export default AlumniHome;
