import { FiEdit2, FiTrash2, FiEye, FiMapPin, FiBriefcase } from 'react-icons/fi';

const JobList = ({ jobs, onEdit, onDelete, onView }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No jobs posted yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="card flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{job.title}</h3>
              <span
                className={`badge ${
                  job.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {job.status || 'Active'}
              </span>
            </div>
            <p className="text-sm text-gray-600">{job.company}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FiMapPin className="w-4 h-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <FiBriefcase className="w-4 h-4" />
                {job.type}
              </span>
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onView && onView(job)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              title="View"
            >
              <FiEye className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEdit && onEdit(job)}
              className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
              title="Edit"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete && onDelete(job)}
              className="p-2 rounded-lg hover:bg-red-100 text-red-600"
              title="Delete"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobList;
