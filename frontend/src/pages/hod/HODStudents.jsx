import { useState, useEffect } from 'react';
import hodApi from '../../api/hod.api';
import { StudentTable } from '../../components/counsellor';
import { Modal, Loader, ErrorAlert, Pagination } from '../../components/shared';
import { FiFilter } from 'react-icons/fi';

const HODStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ year: '', search: '' });
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.year) params.year = filters.year;
      if (filters.search) params.search = filters.search;
      const response = await hodApi.getDepartmentStudents(params);
      const studentsData = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];
      setStudents(studentsData);
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const paginatedStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500">View and manage students in your department</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="input-field"
              >
                <option value="">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Students Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : (
        <StudentTable
          students={paginatedStudents}
          onView={(student) => setSelectedStudent(student)}
          onContact={(student) => window.open(`mailto:${student.email}`)}
        />
      )}

      {/* Pagination */}
      {!loading && students.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(students.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Student Profile Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Student Profile"
        size="lg"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={
                  selectedStudent.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=6366f1&color=fff&size=128`
                }
                alt={selectedStudent.name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedStudent.name}</h3>
                <p className="text-gray-500">{selectedStudent.email}</p>
                <p className="text-sm text-gray-400">
                  {selectedStudent.department} • Year {selectedStudent.year}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Roll Number</p>
                <p className="font-medium text-gray-900">{selectedStudent.rollNo || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">CGPA</p>
                <p className="font-medium text-gray-900">{selectedStudent.cgpa ?? 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium text-gray-900">{selectedStudent.department}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Placement Status</p>
                <p className="font-medium text-gray-900">
                  {selectedStudent.isPlaced ? '✅ Placed' : '⏳ Not Placed'}
                </p>
              </div>
            </div>

            {selectedStudent.skills?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {typeof skill === 'string' ? skill : skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HODStudents;
