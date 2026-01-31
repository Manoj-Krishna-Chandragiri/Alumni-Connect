import { useState } from 'react';
import { FiEye, FiMail, FiSearch, FiCheckCircle, FiClock } from 'react-icons/fi';

const AlumniTable = ({ alumni, onView, onContact }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAlumni = [...alumni]
    .filter((alum) =>
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.company?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      const direction = sortDirection === 'asc' ? 1 : -1;
      return aValue > bValue ? direction : -direction;
    });

  const SortHeader = ({ field, children }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          <span className="text-primary-600">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
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
          placeholder="Search alumni..."
          className="input-field pl-10"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortHeader field="name">Name</SortHeader>
              <SortHeader field="email">Email</SortHeader>
              <SortHeader field="graduationYear">Batch</SortHeader>
              <SortHeader field="company">Company</SortHeader>
              <SortHeader field="jobTitle">Role</SortHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAlumni.map((alum) => (
              <tr key={alum.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={alum.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(alum.name)}&background=6366f1&color=fff`}
                      alt={alum.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {alum.name}
                      </p>
                      <p className="text-xs text-gray-500">{alum.department}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alum.email}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alum.graduationYear}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alum.company || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alum.jobTitle || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {alum.verified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      <FiCheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                      <FiClock className="w-3 h-3" />
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(alum)}
                      className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded"
                      title="View Profile"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onContact(alum)}
                      className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                      title="Send Email"
                    >
                      <FiMail className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedAlumni.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No alumni found
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniTable;
