import { useState, useEffect } from 'react';
import { Loader, ErrorAlert, StatsCard } from '../../components/shared';
import { FiUsers, FiTrendingUp, FiBriefcase, FiAward, FiPieChart, FiGlobe } from 'react-icons/fi';
import principalApi from '../../api/principal.api';

const InstitutionAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await principalApi.getInstitutionInsights();
      setAnalytics(response.data);
    } catch (err) {
      setError('Failed to load institution analytics');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Institution Analytics</h1>
        <p className="text-gray-500">Comprehensive overview of institution-wide statistics</p>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value={analytics?.totalStudents?.toLocaleString() || 0}
          icon={FiUsers}
          color="blue"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Total Alumni"
          value={analytics?.totalAlumni?.toLocaleString() || 0}
          icon={FiUsers}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Placement Rate"
          value={`${analytics?.overallPlacementRate || 0}%`}
          icon={FiTrendingUp}
          color="purple"
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Avg Package"
          value={`₹${analytics?.avgPackage || 0} LPA`}
          icon={FiAward}
          color="orange"
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Department-wise Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Department-wise Placement Statistics
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Department</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Students</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Placed</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Rate</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Progress</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.departmentStats.map((dept, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{dept.dept}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{dept.students}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{dept.placed}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      dept.rate >= 85 ? 'bg-green-100 text-green-700' :
                      dept.rate >= 75 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {dept.rate}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          dept.rate >= 85 ? 'bg-green-500' :
                          dept.rate >= 75 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${dept.rate}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Recruiters & Top Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Recruiters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiBriefcase className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Top Recruiters</h2>
          </div>
          <div className="space-y-3">
            {(analytics?.topRecruiters || []).length > 0 ? (
              analytics.topRecruiters.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-gray-900">{item.company}</span>
                  </div>
                  <span className="text-primary-600 font-semibold">{item.hires} hires</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No recruiter data available</p>
            )}
          </div>
        </div>

        {/* Top Skills */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiAward className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Top Student Skills</h2>
          </div>
          <div className="space-y-3">
            {(analytics?.topSkills || []).length > 0 ? (
              analytics.topSkills.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-gray-900">{item.skill}</span>
                  </div>
                  <span className="text-purple-600 font-semibold">{item.count} students</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No skills data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Key Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <FiPieChart className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-blue-100 text-sm">Highest Package</p>
          <p className="text-2xl font-bold">₹65 LPA</p>
          <p className="text-blue-200 text-sm mt-1">International offer</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <FiTrendingUp className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-green-100 text-sm">Companies Visited</p>
          <p className="text-2xl font-bold">250+</p>
          <p className="text-green-200 text-sm mt-1">This academic year</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <FiAward className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-purple-100 text-sm">PPOs Offered</p>
          <p className="text-2xl font-bold">180</p>
          <p className="text-purple-200 text-sm mt-1">Pre-placement offers</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <FiGlobe className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-orange-100 text-sm">International Offers</p>
          <p className="text-2xl font-bold">45</p>
          <p className="text-orange-200 text-sm mt-1">Across 8 countries</p>
        </div>
      </div>
    </div>
  );
};

export default InstitutionAnalytics;
