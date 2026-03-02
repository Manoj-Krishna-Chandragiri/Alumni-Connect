import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import hodApi from '../../api/hod.api';
import { AnalyticsCard, DepartmentStatsChart } from '../../components/hod';
import { CareerTrendChart } from '../../components/counsellor';
import { Loader, ErrorAlert } from '../../components/shared';
import { FiUsers, FiUserCheck, FiBriefcase, FiAward, FiBookOpen, FiTrendingUp } from 'react-icons/fi';

const HODHome = () => {
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
      const response = await hodApi.getDepartmentStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load department data');
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
      <div className="bg-gradient-to-r from-[#A8422F] via-[#C4503A] to-[#E77E69] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}! 
        </h1>
        <p className="text-primary-100">
          Department analytics and performance overview.
        </p>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <AnalyticsCard
          title="Department Students"
          value={stats?.totalStudents ?? 0}
          icon={FiUsers}
          color="blue"
        />
        <AnalyticsCard
          title="Department Alumni"
          value={stats?.totalAlumni ?? 0}
          icon={FiUserCheck}
          color="green"
        />
        <AnalyticsCard
          title="Placement Rate"
          value={stats?.placementRate ?? 0}
          suffix="%"
          icon={FiBriefcase}
          color="purple"
        />
        <AnalyticsCard
          title="Placements"
          value={stats?.placements ?? 0}
          icon={FiAward}
          color="orange"
        />
        <AnalyticsCard
          title="Verified Alumni"
          value={stats?.verifiedAlumni ?? 0}
          icon={FiBookOpen}
          color="blue"
        />
        <AnalyticsCard
          title="Counsellors"
          value={stats?.totalCounsellors ?? 0}
          icon={FiTrendingUp}
          color="green"
        />
      </div>

      {/* Charts — only shown with real data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentStatsChart title="Year-wise Statistics" />
        {stats?.careerTrends?.length > 0 && (
          <CareerTrendChart data={stats.careerTrends} title="Career Outcomes Trend" />
        )}
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Placements */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Placements
          </h3>
          {stats?.recentPlacements?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentPlacements.map((student, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                      idx === 1 ? 'bg-gray-200 text-gray-700' :
                      idx === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.company}</p>
                    </div>
                  </div>
                  {student.package && (
                    <span className="text-green-600 font-semibold">{student.package}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-6">No placements recorded yet.</p>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Events
          </h3>
          {stats?.upcomingEvents?.length > 0 ? (
            <div className="space-y-3">
              {stats.upcomingEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.type === 'seminar' ? 'bg-yellow-100 text-yellow-700' :
                    event.type === 'workshop' ? 'bg-blue-100 text-blue-700' :
                    event.type === 'webinar' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-6">No upcoming events scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HODHome;
