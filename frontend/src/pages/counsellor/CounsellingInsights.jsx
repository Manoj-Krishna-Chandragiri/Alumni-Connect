import { useState, useEffect } from 'react';
import counsellorApi from '../../api/counsellor.api';
import { Loader, ErrorAlert, StatsCard } from '../../components/shared';
import { FiUsers, FiTrendingUp, FiBookOpen, FiAward, FiLayers } from 'react-icons/fi';

const BAR_COLORS = [
  'bg-primary-600', 'bg-blue-500', 'bg-green-500',
  'bg-purple-500', 'bg-orange-500',
];

const CounsellingInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await counsellorApi.getCounsellingInsights();
      setInsights(response.data);
    } catch (err) {
      setError('Failed to load insights');
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

  const totalStudents = insights?.totalStudents ?? 0;
  const careerInterests = insights?.careerInterests ?? [];
  const topSkills = insights?.topSkills ?? [];
  const yearDistribution = insights?.yearDistribution ?? [];
  const departmentDistribution = insights?.departmentDistribution ?? [];

  // Largest count for relative bar widths
  const maxCareer = careerInterests.length > 0 ? careerInterests[0].count : 1;
  const maxSkill  = topSkills.length > 0 ? topSkills[0].students : 1;
  const maxYear   = yearDistribution.reduce((m, d) => Math.max(m, d.count), 1);
  const maxDept   = departmentDistribution.length > 0 ? departmentDistribution[0].count : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Counselling Insights</h1>
        <p className="text-gray-500">Analyze student career trends and counselling data</p>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value={totalStudents}
          icon={FiUsers}
          color="blue"
        />
        <StatsCard
          title="Active Mentorships"
          value={insights?.activeMentorships ?? 0}
          icon={FiBookOpen}
          color="green"
        />
        <StatsCard
          title="Avg. CGPA"
          value={insights?.avgCgpa ? insights.avgCgpa.toFixed(2) : '–'}
          icon={FiAward}
          color="purple"
        />
        <StatsCard
          title="Placement Rate"
          value={`${insights?.placementRate ?? 0}%`}
          icon={FiTrendingUp}
          color="orange"
        />
      </div>

      {/* Career Interest Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Career Interest Distribution
        </h2>
        {careerInterests.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No career interest data available yet.
          </p>
        ) : (
          <div className="space-y-4">
            {careerInterests.map((item, idx) => {
              const pct = totalStudents > 0
                ? Math.round((item.count / totalStudents) * 100)
                : 0;
              return (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{item.interest}</span>
                    <span className="text-gray-500">
                      {item.count} student{item.count !== 1 ? 's' : ''} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${BAR_COLORS[idx % BAR_COLORS.length]} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(2, Math.round((item.count / maxCareer) * 100))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Skills */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Top Skills Among Students
        </h2>
        {topSkills.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No skills data available yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {topSkills.map((item, idx) => (
              <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">{item.students}</p>
                <p className="text-sm text-gray-600 mt-1 truncate" title={item.skill}>
                  {item.skill}
                </p>
                <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-400 rounded-full"
                    style={{ width: `${Math.round((item.students / maxSkill) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Year Distribution + Department Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Year of Study Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiLayers className="text-primary-600 w-5 h-5" />
            <h2 className="text-lg font-semibold text-gray-900">Year-wise Distribution</h2>
          </div>
          {yearDistribution.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No data available.</p>
          ) : (
            <div className="space-y-3">
              {yearDistribution.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{item.year}</span>
                    <span className="text-gray-500">
                      {item.count} student{item.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${BAR_COLORS[idx % BAR_COLORS.length]} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(4, Math.round((item.count / maxYear) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiUsers className="text-primary-600 w-5 h-5" />
            <h2 className="text-lg font-semibold text-gray-900">Department Overview</h2>
          </div>
          {departmentDistribution.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No data available.</p>
          ) : (
            <div className="space-y-3">
              {departmentDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{item.department}</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounsellingInsights;
