import { FiX } from 'react-icons/fi';

const AlumniFilters = ({ filters, onChange, onClear }) => {
  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Information Technology',
    'Chemical',
    'Biotechnology',
  ];

  const graduationYears = Array.from(
    { length: 30 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <FiX className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            value={filters.department || ''}
            onChange={(e) => handleChange('department', e.target.value)}
            className="input"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Graduation Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Graduation Year
          </label>
          <select
            value={filters.graduationYear || ''}
            onChange={(e) => handleChange('graduationYear', e.target.value)}
            className="input"
          >
            <option value="">All Years</option>
            {graduationYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            type="text"
            value={filters.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="e.g., Google"
            className="input"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={filters.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g., Bangalore"
            className="input"
          />
        </div>
      </div>
    </div>
  );
};

export default AlumniFilters;
