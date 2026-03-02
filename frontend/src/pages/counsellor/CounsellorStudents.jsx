import { useState, useEffect } from 'react';
import counsellorApi from '../../api/counsellor.api';
import { StudentTable } from '../../components/counsellor';
import { Modal, Loader, ErrorAlert, Pagination } from '../../components/shared';
import { FiFilter } from 'react-icons/fi';
import { DEPARTMENTS_LIST } from '../../utils/rollNumberUtils';

const CounsellorStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    department: '',
    year: '',
    cgpaMin: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await counsellorApi.getStudents(filters);
      // Handle paginated response (results array) or direct array
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

  const handleExport = () => {
    // Export logic would go here
    alert('Exporting student data...');
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
          <p className="text-gray-500">
            View and manage student records
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
                {DEPARTMENTS_LIST.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum CGPA
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={filters.cgpaMin}
                onChange={(e) => handleFilterChange('cgpaMin', e.target.value)}
                placeholder="e.g., 7.0"
                className="input-field"
              />
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
            {/* Header */}
            <div className="flex items-center gap-4">
              <img
                src={selectedStudent.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=6366f1&color=fff&size=128`}
                alt={selectedStudent.name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedStudent.name}
                </h3>
                <p className="text-gray-500">{selectedStudent.email}</p>
                <p className="text-sm text-gray-400">
                  {selectedStudent.department} • {selectedStudent.year} Year
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Roll Number</p>
                <p className="font-medium text-gray-900">{selectedStudent.rollNo}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">CGPA</p>
                <p className="font-medium text-gray-900">{selectedStudent.cgpa}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{selectedStudent.phone || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Career Interest</p>
                <p className="font-medium text-gray-900">{selectedStudent.careerInterest || 'Not specified'}</p>
              </div>
            </div>

            {/* Skills */}
            {selectedStudent.skills && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.skills.map((skill, idx) => (
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
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CounsellorStudents;
