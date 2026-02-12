import { useState, useEffect } from 'react';
import counsellorApi from '../../api/counsellor.api';
import { Loader, ErrorAlert, StatsCard } from '../../components/shared';
import { FiUsers, FiTrendingUp, FiCalendar, FiTarget, FiBarChart2 } from 'react-icons/fi';

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
          value={insights?.totalStudents || 1250}
          icon={FiUsers}
          color="blue"
        />
        <StatsCard
          title="Active Mentorships"
          value={insights?.activeMentorships || 145}
          icon={FiTarget}
          color="green"
        />
        <StatsCard
          title="Upcoming Sessions"
          value={insights?.upcomingSessions || 28}
          icon={FiCalendar}
          color="purple"
        />
        <StatsCard
          title="Placement Rate"
          value={`${insights?.placementRate || 78}%`}
          icon={FiTrendingUp}
          color="orange"
        />
      </div>

      {/* Career Interests */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Career Interest Distribution
        </h2>
        <div className="space-y-4">
          {(insights?.careerInterests || [
            { interest: 'Software Development', count: 450 },
            { interest: 'Data Science', count: 280 },
            { interest: 'Product Management', count: 180 },
            { interest: 'Finance', count: 120 },
            { interest: 'Consulting', count: 100 },
          ]).map((item, idx) => {
            const total = 1250;
            const percentage = Math.round((item.count / total) * 100);
            return (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.interest}</span>
                  <span className="text-gray-500">{item.count} students ({percentage}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Skills */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Top Skills Among Students
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(insights?.topSkills || [
            { skill: 'Python', students: 520 },
            { skill: 'JavaScript', students: 480 },
            { skill: 'SQL', students: 400 },
            { skill: 'Machine Learning', students: 320 },
            { skill: 'React', students: 280 },
          ]).map((item, idx) => (
            <div
              key={idx}
              className="text-center p-4 bg-gray-50 rounded-lg"
            >
              <p className="text-2xl font-bold text-primary-600">{item.students}</p>
              <p className="text-sm text-gray-600 mt-1">{item.skill}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Counselling Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Sessions
          </h2>
          <div className="space-y-3">
            {[
              { month: 'January', sessions: 45 },
              { month: 'February', sessions: 52 },
              { month: 'March', sessions: 38 },
              { month: 'April', sessions: 61 },
              { month: 'May', sessions: 55 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{item.month}</span>
                <span className="text-primary-600 font-semibold">{item.sessions} sessions</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Counselling Topics
          </h2>
          <div className="space-y-3">
            {[
              { topic: 'Career Guidance', count: 89 },
              { topic: 'Resume Review', count: 67 },
              { topic: 'Interview Prep', count: 54 },
              { topic: 'Higher Studies', count: 32 },
              { topic: 'Skill Development', count: 28 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{item.topic}</span>
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellingInsights;
