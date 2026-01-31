import { useState, useEffect } from 'react';
import studentApi from '../../api/student.api';
import {
  AlumniCard,
  AlumniFilters,
  AlumniProfileModal,
} from '../../components/student';
import { SearchBar, Pagination, Loader, ErrorAlert, EmptyState } from '../../components/shared';
import { FiUsers } from 'react-icons/fi';

const AlumniDirectory = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    graduationYear: '',
    company: '',
    location: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });

  useEffect(() => {
    fetchAlumni();
  }, [filters, pagination.currentPage]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getAlumniDirectory({
        ...filters,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      });
      setAlumni(response.data);
      // In real API, pagination info would come from response
      setPagination((prev) => ({
        ...prev,
        totalItems: response.data.length,
        totalPages: Math.ceil(response.data.length / prev.itemsPerPage),
      }));
    } catch (err) {
      setError('Failed to load alumni directory');
    } finally {
      setLoading(false);
    }
  };

  const handleAlumniClick = (alumniData) => {
    setSelectedAlumni(alumniData);
    setModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({
      department: '',
      graduationYear: '',
      company: '',
      location: '',
      search: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alumni Directory</h1>
        <p className="text-gray-500">
          Connect with alumni from your institution
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          value={filters.search}
          onChange={(value) => setFilters({ ...filters, search: value })}
          placeholder="Search by name, company, or skills..."
        />
      </div>

      {/* Filters */}
      <AlumniFilters
        filters={filters}
        onChange={setFilters}
        onClear={handleClearFilters}
      />

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : alumni.length === 0 ? (
        <EmptyState
          icon={FiUsers}
          title="No alumni found"
          description="Try adjusting your filters or search terms"
          action={handleClearFilters}
          actionLabel="Clear Filters"
        />
      ) : (
        <>
          <div className="text-sm text-gray-500">
            Showing {alumni.length} alumni
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alumni.map((alumniItem) => (
              <AlumniCard
                key={alumniItem.id}
                alumni={alumniItem}
                onClick={handleAlumniClick}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={(page) =>
                setPagination({ ...pagination, currentPage: page })
              }
            />
          )}
        </>
      )}

      {/* Alumni Profile Modal */}
      <AlumniProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        alumni={selectedAlumni}
      />
    </div>
  );
};

export default AlumniDirectory;
