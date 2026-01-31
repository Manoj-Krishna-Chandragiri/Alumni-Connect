import { useState } from 'react';
import { FiEdit2, FiTrash2, FiEye, FiMail, FiSearch } from 'react-icons/fi';

const StudentTable = ({ students, onView, onEdit, onDelete, onContact }) => {
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

  const sortedStudents = [...students]
    .filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
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
          placeholder="Search students..."
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
              <SortHeader field="department">Department</SortHeader>
              <SortHeader field="year">Year</SortHeader>
              <SortHeader field="cgpa">CGPA</SortHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=6366f1&color=fff`}
                      alt={student.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500">{student.rollNo}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.email}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.department}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.year}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    student.cgpa >= 8 ? 'text-green-600' : 
                    student.cgpa >= 6 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {student.cgpa}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(student)}
                      className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded"
                      title="View Profile"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onContact(student)}
                      className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                      title="Send Email"
                    >
                      <FiMail className="w-4 h-4" />
                    </button>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(student)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(student)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No students found
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTable;
