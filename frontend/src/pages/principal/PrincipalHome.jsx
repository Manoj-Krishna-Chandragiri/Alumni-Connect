import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import principalApi from '../../api/principal.api';
import {
  InstitutionSummary,
  PlacementTrendsChart,
  AlumniDistributionChart,
} from '../../components/principal';
import { DepartmentStatsChart } from '../../components/hod';
import { Loader, ErrorAlert } from '../../components/shared';

const PrincipalHome = () => {
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
      const response = await principalApi.getInstitutionStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load institution data');
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
          Institution-wide analytics and performance overview.
        </p>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Institution Summary */}
      <InstitutionSummary stats={stats} />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlacementTrendsChart />
        <AlumniDistributionChart title="Alumni Industry Distribution" />
      </div>

      {/* Department Stats */}
      <DepartmentStatsChart title="Department-wise Statistics" />

      {/* Key Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Recruiters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Recruiters
          </h3>
          <div className="space-y-3">
            {(stats?.topRecruiters || []).length > 0 ? (
              stats.topRecruiters.map((company, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{company.name}</span>
                  <span className="text-sm text-gray-500">{company.hires} hires</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No placement data available</p>
            )}
          </div>
        </div>

        {/* Notable Alumni */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Notable Alumni
          </h3>
          <div className="space-y-3">
            {(stats?.notableAlumni || []).length > 0 ? (
              stats.notableAlumni.map((alum, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                >
                  <img
                    src={alum.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(alum.name)}&background=6366f1&color=fff`}
                    alt={alum.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{alum.name}</p>
                    <p className="text-xs text-gray-500">
                      {alum.currentPosition && `${alum.currentPosition}, `}{alum.currentCompany}
                      {alum.graduationYear && ` • Batch ${alum.graduationYear}`}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No alumni data available</p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {(stats?.upcomingEvents || []).length > 0 ? (
              stats.upcomingEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                      {event.event_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{event.date}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalHome;
