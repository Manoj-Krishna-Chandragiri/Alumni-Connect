import { FiUsers, FiUserCheck, FiBriefcase, FiAward, FiGlobe, FiTrendingUp } from 'react-icons/fi';

const InstitutionSummary = ({ stats }) => {
  const summaryItems = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 5200,
      icon: FiUsers,
      color: 'blue',
      change: '+12%',
    },
    {
      title: 'Total Alumni',
      value: stats?.totalAlumni || 28500,
      icon: FiUserCheck,
      color: 'green',
      change: '+8%',
    },
    {
      title: 'Placement Rate',
      value: `${stats?.placementRate || 92}%`,
      icon: FiBriefcase,
      color: 'purple',
      change: '+5%',
    },
    {
      title: 'Avg Package',
      value: `${stats?.avgPackage || 18.5} LPA`,
      icon: FiAward,
      color: 'orange',
      change: '+15%',
    },
    {
      title: 'Global Presence',
      value: `${stats?.countries || 45} Countries`,
      icon: FiGlobe,
      color: 'blue',
      change: '+3',
    },
    {
      title: 'Industry Partners',
      value: stats?.partners || 250,
      icon: FiTrendingUp,
      color: 'green',
      change: '+28',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Institution Summary
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {summaryItems.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border ${colorClasses[item.color]}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.title}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
              </span>
              <span className="text-xs font-medium text-green-600">
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstitutionSummary;
