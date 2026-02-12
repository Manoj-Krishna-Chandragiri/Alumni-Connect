import { FiX, FiMapPin, FiBriefcase, FiClock, FiExternalLink, FiCalendar, FiUsers } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const JobDetailModal = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'Recently';
    }
  };

  const formatSalary = (salaryStr) => {
    if (!salaryStr) return null;
    let cleaned = salaryStr.replace(/[$₹]/g, '').trim();
    if (cleaned.toLowerCase().includes('lpa')) {
      return cleaned.replace(/(\d+)/g, (match) => {
        const num = parseInt(match.replace(/,/g, ''));
        if (num >= 100000) {
          return (num / 100000).toFixed(1);
        }
        return match;
      });
    }
    return cleaned;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Cover Image */}
        {job.coverImage && (
          <div className="h-48 overflow-hidden rounded-t-lg">
            <img
              src={job.coverImage}
              alt={job.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Job Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-14 h-14 object-contain"
                />
              ) : (
                <FiBriefcase className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h2>
              <p className="text-lg text-gray-600">{job.company}</p>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <FiMapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-500 text-xs">Location</p>
                <p className="font-medium text-gray-900">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FiBriefcase className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-500 text-xs">Job Type</p>
                <p className="font-medium text-gray-900 capitalize">{job.type || job.job_type}</p>
              </div>
            </div>
            {(job.salary || (job.salary_min && job.salary_max)) && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg">₹</span>
                <div>
                  <p className="text-gray-500 text-xs">Salary</p>
                  <p className="font-medium text-gray-900">
                    {job.salary
                      ? formatSalary(job.salary)
                      : `₹${(job.salary_min / 100000).toFixed(1)}-${(job.salary_max / 100000).toFixed(1)} LPA`
                    }
                  </p>
                </div>
              </div>
            )}
            {job.experience && (
              <div className="flex items-center gap-2 text-sm">
                <FiClock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-500 text-xs">Experience</p>
                  <p className="font-medium text-gray-900">{job.experience}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <FiCalendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-500 text-xs">Posted</p>
                <p className="font-medium text-gray-900">{formatDate(job.createdAt || job.created_at)}</p>
              </div>
            </div>
            {job.applications_count !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <FiUsers className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-500 text-xs">Applications</p>
                  <p className="font-medium text-gray-900">{job.applications_count}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
            <div className="prose prose-sm max-w-none text-gray-600">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {job.description}
              </ReactMarkdown>
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply Button */}
          <div className="flex gap-3 pt-6 border-t">
            <a
              href={job.applicationLink || job.application_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              Apply Now
              <FiExternalLink className="w-4 h-4" />
            </a>
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
