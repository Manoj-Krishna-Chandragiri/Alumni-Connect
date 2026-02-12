import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminApi from '../../api/admin.api';
import { StatsCard, Loader, ErrorAlert } from '../../components/shared';
import { FiUsers, FiUserCheck, FiUserPlus, FiAlertCircle, FiCalendar, FiBriefcase } from 'react-icons/fi';

const AdminHome = () => {
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
      const response = await adminApi.getDashboardStats();
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
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-300">
          System administration and management dashboard.
        </p>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 6250}
          icon={FiUsers}
          color="blue"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Verified Alumni"
          value={stats?.verifiedAlumni || 2850}
          icon={FiUserCheck}
          color="green"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Pending Verifications"
          value={stats?.pendingVerifications || 45}
          icon={FiUserPlus}
          color="orange"
        />
        <StatsCard
          title="Active Events"
          value={stats?.activeEvents || 12}
          icon={FiCalendar}
          color="purple"
        />
        <StatsCard
          title="Job Postings"
          value={stats?.jobPostings || 156}
          icon={FiBriefcase}
          color="blue"
        />
        <StatsCard
          title="Reported Issues"
          value={stats?.reportedIssues || 3}
          icon={FiAlertCircle}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="/admin/verify-alumni"
          className="card-hover p-4 flex items-center gap-3"
        >
          <div className="p-3 bg-orange-100 rounded-lg">
            <FiUserPlus className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Verify Alumni</p>
            <p className="text-sm text-gray-500">45 pending</p>
          </div>
        </a>
        <a
          href="/admin/users"
          className="card-hover p-4 flex items-center gap-3"
        >
          <div className="p-3 bg-blue-100 rounded-lg">
            <FiUsers className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Manage Users</p>
            <p className="text-sm text-gray-500">6,250 users</p>
          </div>
        </a>
        <a
          href="/admin/events"
          className="card-hover p-4 flex items-center gap-3"
        >
          <div className="p-3 bg-purple-100 rounded-lg">
            <FiCalendar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Manage Events</p>
            <p className="text-sm text-gray-500">12 active</p>
          </div>
        </a>
        <a
          href="/admin/settings"
          className="card-hover p-4 flex items-center gap-3"
        >
          <div className="p-3 bg-gray-100 rounded-lg">
            <FiAlertCircle className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">System Settings</p>
            <p className="text-sm text-gray-500">Configure</p>
          </div>
        </a>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Registrations
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Amit Kumar', role: 'Student', time: '2 hours ago' },
              { name: 'Priya Sharma', role: 'Alumni', time: '5 hours ago' },
              { name: 'Rahul Singh', role: 'Student', time: '8 hours ago' },
              { name: 'Neha Gupta', role: 'Alumni', time: '1 day ago' },
              { name: 'Vikram Patel', role: 'Student', time: '1 day ago' },
            ].map((user, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.time}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user.role === 'Student' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Alerts
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Database backup completed', type: 'success', time: '1 hour ago' },
              { title: 'High traffic detected', type: 'warning', time: '3 hours ago' },
              { title: 'New version available', type: 'info', time: '1 day ago' },
              { title: 'SSL certificate renewal', type: 'warning', time: '5 days left' },
            ].map((alert, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${
                  alert.type === 'success' ? 'bg-green-50 border border-green-200' :
                  alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className={`font-medium ${
                    alert.type === 'success' ? 'text-green-800' :
                    alert.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {alert.title}
                  </p>
                  <span className={`text-sm ${
                    alert.type === 'success' ? 'text-green-600' :
                    alert.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    {alert.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
