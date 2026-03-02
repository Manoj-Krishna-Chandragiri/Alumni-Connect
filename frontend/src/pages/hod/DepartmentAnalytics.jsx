import { useState, useEffect } from 'react';
import hodApi from '../../api/hod.api';
import { Loader, ErrorAlert, StatsCard } from '../../components/shared';
import { FiUsers, FiTrendingUp, FiBriefcase, FiAward, FiBarChart2 } from 'react-icons/fi';

const DepartmentAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    hodApi.getDepartmentInsights()
      .then(res => setAnalytics(res.data))
      .catch(() => setError('Failed to load analytics data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Department Analytics</h1>
        <p className="text-gray-500">Analyze department performance and trends</p>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value={analytics?.totalStudents || 0}
          icon={FiUsers}
          color="blue"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Alumni"
          value={analytics?.totalAlumni || 0}
          icon={FiUsers}
          color="green"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Placement Rate"
          value={`${analytics?.placementRate ?? 0}%`}
          icon={FiTrendingUp}
          color="purple"
        />
        <StatsCard
          title="Avg CGPA"
          value={analytics?.avgCgpa ?? 0}
          icon={FiAward}
          color="orange"
        />
      </div>

      {/* Top Recruiters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Top Recruiters
        </h2>
        {analytics?.topRecruiters?.length > 0 ? (
          <div className="space-y-3">
            {analytics.topRecruiters.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FiBriefcase className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="font-medium text-gray-900">{item.company}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600">{item.hires} hires</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-6">No placement data available yet.</p>
        )}
      </div>

      {/* Year-wise (Current Students) Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Student Year-wise Distribution
        </h2>
        {analytics?.yearDistribution?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Year</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Students</th>
                </tr>
              </thead>
              <tbody>
                {analytics.yearDistribution.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{item.year}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {item.count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-6">No student distribution data available.</p>
        )}
      </div>

      {/* Top Skills */}
      {analytics?.topSkills?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Skills in Department</h2>
          <div className="flex flex-wrap gap-2">
            {analytics.topSkills.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-primary-50 text-primary-700 border border-primary-200 rounded-full text-sm font-medium"
              >
                {item.skill} <span className="text-primary-400">({item.count})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentAnalytics;
