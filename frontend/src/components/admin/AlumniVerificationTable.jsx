import { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiEye, FiSearch } from 'react-icons/fi';

const AlumniVerificationTable = ({ alumni, onVerify, onReject, onView }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const normalizedAlumni = alumni.map((alum) => ({
    ...alum,
    name: alum.name ?? alum.fullName ?? alum.full_name ?? `${alum.firstName ?? ''} ${alum.lastName ?? ''}`.trim() ?? 'Unknown',
    email: alum.email ?? '',
  }));

  const filteredAlumni = normalizedAlumni.filter(
    (alum) =>
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search pending alumni..."
          className="input-field pl-10"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied On
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAlumni.map((alum) => (
              <tr key={alum.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={alum.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(alum.name)}&background=6366f1&color=fff`}
                      alt={alum.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {alum.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alum.email}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alum.graduationYear}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alum.department}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alum.appliedOn ? new Date(alum.appliedOn).toLocaleDateString() : alum.createdAt ? new Date(alum.createdAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(alum)}
                      className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded"
                      title="View Details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onVerify(alum)}
                      className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                      title="Approve"
                    >
                      <FiCheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onReject(alum)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Reject"
                    >
                      <FiXCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAlumni.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No pending verification requests
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniVerificationTable;
