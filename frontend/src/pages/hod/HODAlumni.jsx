import { useState, useEffect } from 'react';
import hodApi from '../../api/hod.api';
import { AlumniTable } from '../../components/counsellor';
import { Modal, Loader, ErrorAlert, Pagination } from '../../components/shared';
import { FiFilter } from 'react-icons/fi';

const HODAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ graduationYear: '', search: '' });
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAlumni();
  }, [filters]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.graduationYear) params.graduation_year = filters.graduationYear;
      const response = await hodApi.getDepartmentAlumni(params);
      const alumniData = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];
      setAlumni(alumniData);
    } catch (err) {
      setError('Failed to load alumni');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const paginatedAlumni = alumni.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alumni</h1>
          <p className="text-gray-500">View alumni records and engagement in your department</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center gap-2 self-start"
        >
          <FiFilter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by name or email..."
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
              <select
                value={filters.graduationYear}
                onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
                className="input-field"
              >
                <option value="">All Years</option>
                {graduationYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Alumni Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : (
        <AlumniTable
          alumni={paginatedAlumni}
          onView={(alum) => setSelectedAlumni(alum)}
          onContact={(alum) => window.open(`mailto:${alum.email}`)}
        />
      )}

      {/* Pagination */}
      {!loading && alumni.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(alumni.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Alumni Profile Modal */}
      <Modal
        isOpen={!!selectedAlumni}
        onClose={() => setSelectedAlumni(null)}
        title="Alumni Profile"
        size="lg"
      >
        {selectedAlumni && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={
                  selectedAlumni.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAlumni.name)}&background=6366f1&color=fff&size=128`
                }
                alt={selectedAlumni.name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedAlumni.name}</h3>
                <p className="text-gray-500">{selectedAlumni.email}</p>
                <p className="text-sm text-gray-400">
                  {selectedAlumni.department} • Batch of {selectedAlumni.graduationYear}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Current Company</p>
                <p className="font-medium text-gray-900">{selectedAlumni.currentCompany || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Current Position</p>
                <p className="font-medium text-gray-900">{selectedAlumni.currentPosition || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium text-gray-900">{selectedAlumni.department}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Verification Status</p>
                <p className="font-medium text-gray-900">
                  {selectedAlumni.isVerified ? '✅ Verified' : '⏳ Pending'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HODAlumni;
