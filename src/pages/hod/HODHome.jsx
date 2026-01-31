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
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
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
          value={stats?.totalStudents || 450}
          previousValue={420}
          icon={FiUsers}
          color="blue"
        />
        <AnalyticsCard
          title="Department Alumni"
          value={stats?.totalAlumni || 1200}
          previousValue={1150}
          icon={FiUserCheck}
          color="green"
        />
        <AnalyticsCard
          title="Placement Rate"
          value={stats?.placementRate || 85}
          previousValue={82}
          suffix="%"
          icon={FiBriefcase}
          color="purple"
        />
        <AnalyticsCard
          title="Average Package"
          value={stats?.avgPackage || 12.5}
          previousValue={11.8}
          suffix="LPA"
          icon={FiAward}
          color="orange"
        />
        <AnalyticsCard
          title="Higher Studies"
          value={stats?.higherStudies || 45}
          previousValue={40}
          icon={FiBookOpen}
          color="blue"
        />
        <AnalyticsCard
          title="Industry Partners"
          value={stats?.partners || 28}
          previousValue={25}
          icon={FiTrendingUp}
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentStatsChart title="Year-wise Statistics" />
        <CareerTrendChart title="Career Outcomes Trend" />
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Placed Students */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Placed Students
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Priya Sharma', company: 'Google', package: '45 LPA', rank: 1 },
              { name: 'Vikram Singh', company: 'Meta', package: '50 LPA', rank: 2 },
              { name: 'Anita Patel', company: 'Amazon', package: '42 LPA', rank: 3 },
              { name: 'Rahul Kumar', company: 'Microsoft', package: '38 LPA', rank: 4 },
            ].map((student) => (
              <div
                key={student.rank}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                    student.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                    student.rank === 2 ? 'bg-gray-200 text-gray-700' :
                    student.rank === 3 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    #{student.rank}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.company}</p>
                  </div>
                </div>
                <span className="text-green-600 font-semibold">
                  {student.package}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alumni Mentors */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Active Alumni Mentors
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Dr. Amit Verma', company: 'IIT Delhi', students: 15, batch: 2010 },
              { name: 'Sneha Gupta', company: 'Adobe', students: 12, batch: 2015 },
              { name: 'Rajesh Nair', company: 'Flipkart', students: 10, batch: 2012 },
              { name: 'Meera Joshi', company: 'Netflix', students: 8, batch: 2014 },
            ].map((mentor, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=6366f1&color=fff`}
                    alt={mentor.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{mentor.name}</p>
                    <p className="text-sm text-gray-500">{mentor.company} • Batch {mentor.batch}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {mentor.students} students
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HODHome;
