import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminApi from '../../api/admin.api';
import { StatsCard, Loader, ErrorAlert } from '../../components/shared';
import { FiUsers, FiUserCheck, FiUserPlus, FiAlertCircle, FiCalendar, FiBriefcase } from 'react-icons/fi';

const AdminHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    fetchRecentUsers();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const response = await adminApi.getRecentUsers(5);
      setRecentUsers(response.data || []);
    } catch (err) {
      console.error('Error fetching recent users:', err);
      // Don't show error for this, it's not critical
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
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
        <p className="text-rose-100">
          System administration and management dashboard.
        </p>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || stats?.total_users || 0}
          icon={FiUsers}
          color="blue"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Verified Alumni"
          value={stats?.verifiedAlumni || stats?.verified_alumni || 0}
          icon={FiUserCheck}
          color="green"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Pending Verifications"
          value={stats?.pendingVerifications || stats?.pending_verifications || 0}
          icon={FiUserPlus}
          color="orange"
        />
        <StatsCard
          title="Active Events"
          value={stats?.activeEvents || stats?.total_events || 0}
          icon={FiCalendar}
          color="purple"
        />
        <StatsCard
          title="Job Postings"
          value={stats?.jobPostings || stats?.total_jobs || 0}
          icon={FiBriefcase}
          color="blue"
        />
        <StatsCard
          title="Reported Issues"
          value={stats?.reportedIssues || 0}
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
            <p className="text-sm text-gray-500">
              {stats?.pendingVerifications || stats?.pending_verifications || 0} pending
            </p>
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
            <p className="text-sm text-gray-500">
              {stats?.totalUsers || stats?.total_users || 0} users
            </p>
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
            <p className="text-sm text-gray-500">
              {stats?.activeEvents || stats?.total_events || 0} active
            </p>
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
            {recentUsers.length > 0 ? (
              recentUsers.map((user, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=6366f1&color=fff`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{user.name || 'User'}</p>
                      <p className="text-sm text-gray-500">{getTimeAgo(user.created_at)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'student' ? 'bg-blue-100 text-blue-700' : 
                    user.role === 'alumni' ? 'bg-green-100 text-green-700' :
                    user.role === 'counsellor' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'hod' ? 'bg-indigo-100 text-indigo-700' :
                    user.role === 'principal' ? 'bg-rose-100 text-rose-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No recent registrations</p>
            )}
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Overview
          </h3>
          <div className="space-y-3">
            {stats ? (() => {
              const pending = stats.pendingVerifications || 0;
              const events = stats.activeEvents || stats.total_events || 0;
              const jobs = stats.jobPostings || stats.total_jobs || 0;
              const students = stats.studentCount || stats.total_students || 0;
              const alumni = stats.alumniCount || stats.total_alumni || 0;
              const hods = stats.hodCount || 0;
              const counsellors = stats.counsellorCount || 0;

              const items = [
                pending > 0
                  ? { title: `${pending} alumni awaiting verification`, type: 'warning', detail: 'Needs action' }
                  : { title: 'All alumni verified', type: 'success', detail: 'Up to date' },
                { title: `${students} students · ${alumni} alumni enrolled`, type: 'info', detail: 'Active users' },
                { title: `${hods} HODs · ${counsellors} counsellors on staff`, type: 'info', detail: 'Staff' },
                events > 0
                  ? { title: `${events} active event${events !== 1 ? 's' : ''} on calendar`, type: 'info', detail: 'Scheduled' }
                  : { title: 'No active events', type: 'warning', detail: 'Add events' },
                { title: `${jobs} active job posting${jobs !== 1 ? 's' : ''}`, type: jobs > 0 ? 'success' : 'warning', detail: jobs > 0 ? 'Live' : 'None posted' },
              ];

              return items.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    item.type === 'success' ? 'bg-green-50 border border-green-200' :
                    item.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`font-medium text-sm ${
                      item.type === 'success' ? 'text-green-800' :
                      item.type === 'warning' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>
                      {item.title}
                    </p>
                    <span className={`text-xs font-medium ${
                      item.type === 'success' ? 'text-green-600' :
                      item.type === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      {item.detail}
                    </span>
                  </div>
                </div>
              ));
            })() : (
              <p className="text-center text-gray-500 py-4">Loading system data...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
