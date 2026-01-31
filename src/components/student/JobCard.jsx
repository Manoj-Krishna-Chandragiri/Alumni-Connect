import {
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiClock,
  FiExternalLink,
  FiBookmark,
} from 'react-icons/fi';

const JobCard = ({ job, onApply }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-10 h-10 object-contain"
              />
            ) : (
              <FiBriefcase className="w-6 h-6 text-gray-400" />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.company}</p>
          </div>
        </div>

        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
          <FiBookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Job Details */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <FiMapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <FiBriefcase className="w-4 h-4" />
          <span>{job.type}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <FiDollarSign className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
        )}
        {job.experience && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <FiClock className="w-4 h-4" />
            <span>{job.experience}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{job.description}</p>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="badge bg-gray-100 text-gray-700">
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-xs text-gray-500">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          Posted {formatDate(job.createdAt)}
        </span>

        {/* Posted By */}
        {job.postedBy && (
          <span className="text-sm text-gray-500">
            By {job.postedBy.name} ({job.postedBy.role})
          </span>
        )}
      </div>

      {/* Apply Button */}
      <a
        href={job.applicationLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onApply && onApply(job)}
        className="w-full btn-primary mt-4 flex items-center justify-center gap-2"
      >
        Apply Now
        <FiExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
};

export default JobCard;
