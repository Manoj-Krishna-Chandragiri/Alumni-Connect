import { useState, useEffect } from 'react';
import adminApi from '../../api/admin.api';
import { Loader, ErrorAlert, SearchBar, Pagination, ConfirmModal } from '../../components/shared';
import { FiUsers, FiBriefcase, FiMapPin, FiEye, FiTrash2, FiDownload, FiCheckCircle } from 'react-icons/fi';

const ManageAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [deleteAlumni, setDeleteAlumni] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAlumni();
      // Handle paginated response (results array) or direct array
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

  const handleDeactivate = async () => {
    try {
      setProcessing(true);
      await adminApi.deactivateAlumni(deleteAlumni.id);
      setDeleteAlumni(null);
      fetchAlumni();
    } catch (err) {
      setError('Failed to deactivate alumni');
    } finally {
      setProcessing(false);
    }
  };

  const filteredAlumni = alumni.filter(
    (a) =>
      a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedAlumni = filteredAlumni.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Alumni</h1>
          <p className="text-gray-500">View and manage all alumni accounts</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <FiDownload className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, email, or company..."
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-600 text-sm font-medium">Total Alumni</p>
          <p className="text-2xl font-bold text-blue-800">{alumni.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm font-medium">Verified</p>
          <p className="text-2xl font-bold text-green-800">
            {alumni.filter((a) => a.verified).length}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-purple-600 text-sm font-medium">Companies</p>
          <p className="text-2xl font-bold text-purple-800">
            {new Set(alumni.map((a) => a.company)).size}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-orange-600 text-sm font-medium">Active Contributors</p>
          <p className="text-2xl font-bold text-orange-800">
            {alumni.filter((a) => a.jobsPosted > 0 || a.blogsPosted > 0).length}
          </p>
        </div>
      </div>

      {/* Alumni Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alumni
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Graduation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedAlumni.map((alum) => (
                  <tr key={alum.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={alum.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(alum.name)}&background=6366f1&color=fff`}
                          alt={alum.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{alum.name}</p>
                            {alum.verified && (
                              <FiCheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{alum.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiBriefcase className="w-4 h-4" />
                        {alum.company || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {alum.graduationYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiMapPin className="w-4 h-4" />
                        {alum.location || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          alum.verified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {alum.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedAlumni(alum)}
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteAlumni(alum)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedAlumni.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No alumni found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredAlumni.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredAlumni.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Deactivate Confirmation */}
      <ConfirmModal
        isOpen={!!deleteAlumni}
        onClose={() => setDeleteAlumni(null)}
        onConfirm={handleDeactivate}
        title="Deactivate Alumni"
        message={`Are you sure you want to deactivate ${deleteAlumni?.name}'s account?`}
        confirmText={processing ? 'Deactivating...' : 'Deactivate'}
        variant="danger"
      />
    </div>
  );
};

export default ManageAlumni;
