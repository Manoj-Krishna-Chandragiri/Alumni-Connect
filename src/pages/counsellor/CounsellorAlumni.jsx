import { useState, useEffect } from 'react';
import counsellorApi from '../../api/counsellor.api';
import { AlumniTable } from '../../components/counsellor';
import { Modal, Loader, ErrorAlert, Pagination } from '../../components/shared';
import { FiFilter, FiDownload } from 'react-icons/fi';

const CounsellorAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    department: '',
    graduationYear: '',
    verified: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAlumni();
  }, [filters]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const response = await counsellorApi.getAlumni(filters);
      setAlumni(response.data);
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

  const handleExport = () => {
    alert('Exporting alumni data...');
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
          <p className="text-gray-500">
            View alumni records and engagement
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <FiFilter className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={handleExport}
            className="btn-primary flex items-center gap-2"
          >
            <FiDownload className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="input-field"
              >
                <option value="">All Departments</option>
                <option value="cse">Computer Science</option>
                <option value="ece">Electronics</option>
                <option value="me">Mechanical</option>
                <option value="ce">Civil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Graduation Year
              </label>
              <select
                value={filters.graduationYear}
                onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
                className="input-field"
              >
                <option value="">All Years</option>
                {graduationYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.verified}
                onChange={(e) => handleFilterChange('verified', e.target.value)}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="true">Verified</option>
                <option value="false">Pending</option>
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
            {/* Header */}
            <div className="flex items-center gap-4">
              <img
                src={selectedAlumni.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAlumni.name)}&background=6366f1&color=fff&size=128`}
                alt={selectedAlumni.name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedAlumni.name}
                </h3>
                <p className="text-gray-500">{selectedAlumni.email}</p>
                <p className="text-sm text-gray-400">
                  {selectedAlumni.department} • Batch of {selectedAlumni.graduationYear}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Current Company</p>
                <p className="font-medium text-gray-900">{selectedAlumni.company || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Job Title</p>
                <p className="font-medium text-gray-900">{selectedAlumni.jobTitle || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{selectedAlumni.location || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">LinkedIn</p>
                <p className="font-medium text-gray-900">
                  {selectedAlumni.linkedin ? (
                    <a href={selectedAlumni.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      View Profile
                    </a>
                  ) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Skills */}
            {selectedAlumni.skills && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAlumni.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            {selectedAlumni.bio && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">About</p>
                <p className="text-gray-600">{selectedAlumni.bio}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CounsellorAlumni;
