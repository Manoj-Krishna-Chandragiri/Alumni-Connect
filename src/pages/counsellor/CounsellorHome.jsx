import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import counsellorApi from '../../api/counsellor.api';
import { CareerTrendChart } from '../../components/counsellor';
import { StatsCard, Loader, ErrorAlert } from '../../components/shared';
import { FiUsers, FiUserCheck, FiBriefcase, FiTrendingUp } from 'react-icons/fi';

const CounsellorHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await counsellorApi.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-primary-100">
          Monitor student progress and placement trends.
        </p>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value={stats?.totalStudents || 1250}
          icon={FiUsers}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Verified Alumni"
          value={stats?.verifiedAlumni || 856}
          icon={FiUserCheck}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Placements"
          value={stats?.placements || 324}
          icon={FiBriefcase}
          color="purple"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Placement Rate"
          value={`${stats?.placementRate || 78}%`}
          icon={FiTrendingUp}
          color="orange"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Career Trend Chart */}
      <CareerTrendChart title="Placement Trends (Last 6 Months)" />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Placements */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Placements
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Priya Sharma', company: 'Google', package: '45 LPA' },
              { name: 'Rahul Kumar', company: 'Microsoft', package: '38 LPA' },
              { name: 'Anita Patel', company: 'Amazon', package: '42 LPA' },
              { name: 'Vikram Singh', company: 'Meta', package: '50 LPA' },
            ].map((placement, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(placement.name)}&background=6366f1&color=fff`}
                    alt={placement.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{placement.name}</p>
                    <p className="text-sm text-gray-500">{placement.company}</p>
                  </div>
                </div>
                <span className="text-green-600 font-semibold">
                  {placement.package}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Career Fair 2024', date: 'Jan 15', type: 'fair' },
              { title: 'Resume Workshop', date: 'Jan 18', type: 'workshop' },
              { title: 'Mock Interview Session', date: 'Jan 20', type: 'workshop' },
              { title: 'Alumni Meetup', date: 'Jan 25', type: 'meetup' },
            ].map((event, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  event.type === 'fair' ? 'bg-purple-100 text-purple-700' :
                  event.type === 'workshop' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorHome;
