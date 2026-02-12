import { useState, useEffect } from 'react';
import { Loader, ErrorAlert, StatsCard } from '../../components/shared';
import { FiUsers, FiTrendingUp, FiBriefcase, FiAward, FiBarChart2 } from 'react-icons/fi';

const DepartmentAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalytics({
        totalStudents: 450,
        totalAlumni: 1250,
        placementRate: 85,
        avgPackage: 12.5,
        topRecruiters: [
          { company: 'Google', hires: 15 },
          { company: 'Microsoft', hires: 12 },
          { company: 'Amazon', hires: 10 },
          { company: 'Meta', hires: 8 },
          { company: 'Apple', hires: 6 },
        ],
        yearWiseStats: [
          { year: '2021', placed: 85, higherStudies: 30 },
          { year: '2022', placed: 92, higherStudies: 28 },
          { year: '2023', placed: 88, higherStudies: 35 },
          { year: '2024', placed: 95, higherStudies: 32 },
        ],
      });
      setLoading(false);
    }, 500);
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
          value={`${analytics?.placementRate || 0}%`}
          icon={FiTrendingUp}
          color="purple"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Avg Package"
          value={`₹${analytics?.avgPackage || 0} LPA`}
          icon={FiAward}
          color="orange"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Top Recruiters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Top Recruiters
        </h2>
        <div className="space-y-3">
          {analytics?.topRecruiters.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FiBriefcase className="w-5 h-5 text-primary-600" />
                </div>
                <span className="font-medium text-gray-900">{item.company}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary-600">{item.hires} hires</p>
                <p className="text-xs text-gray-500">Last 3 years</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Year-wise Statistics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Year-wise Placement Statistics
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Year</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Placed</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Higher Studies</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.yearWiseStats.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{item.year}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {item.placed}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {item.higherStudies}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-gray-900">
                    {item.placed + item.higherStudies}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <FiBarChart2 className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-blue-100 text-sm">Highest Package</p>
          <p className="text-2xl font-bold">₹45 LPA</p>
          <p className="text-blue-200 text-sm mt-1">Google, 2024</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <FiTrendingUp className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-green-100 text-sm">Average Package</p>
          <p className="text-2xl font-bold">₹12.5 LPA</p>
          <p className="text-green-200 text-sm mt-1">+15% from last year</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <FiUsers className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-purple-100 text-sm">Total Companies</p>
          <p className="text-2xl font-bold">45+</p>
          <p className="text-purple-200 text-sm mt-1">Visited this year</p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentAnalytics;
