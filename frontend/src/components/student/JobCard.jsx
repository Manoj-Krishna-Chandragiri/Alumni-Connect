import { useState } from 'react';
import {
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiExternalLink,
  FiBookmark,
} from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const JobCard = ({ job, onApply, onSave }) => {
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (error) {
      return 'Recently';
    }
  };

  const formatSalary = (salaryStr) => {
    if (!salaryStr) return null;
    
    // Remove any currency symbols and clean the string
    let cleaned = salaryStr.replace(/[$₹]/g, '').trim();
    
    // If already has LPA, just format the numbers
    if (cleaned.toLowerCase().includes('lpa')) {
      return cleaned.replace(/(\d+)/g, (match) => {
        const num = parseInt(match.replace(/,/g, ''));
        if (num >= 100000) {
          // Convert to LPA format
          return (num / 100000).toFixed(1);
        }
        return match;
      });
    }
    
    return cleaned;
  };

  const handleSaveClick = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (onSave) {
        await onSave(job.id);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Failed to save job:', error);
      alert('Failed to bookmark job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Cover Image */}
      {job.coverImage && (
        <div className="h-40 overflow-hidden">
          <img
            src={job.coverImage}
            alt={job.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
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

          <button
            onClick={handleSaveClick}
            disabled={saving}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isSaved ? (
              <FaBookmark className="w-5 h-5 text-primary-600" />
            ) : (
              <FiBookmark className="w-5 h-5" />
            )}
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
        {(job.salary || (job.salary_min && job.salary_max)) && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="text-base">₹</span>
            <span>
              {job.salary 
                ? formatSalary(job.salary)
                : `₹${(job.salary_min / 100000).toFixed(1)}-${(job.salary_max / 100000).toFixed(1)} LPA`
              }
            </span>
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
        <div className="text-sm text-gray-600 mb-4">
          <div className={expanded ? '' : 'line-clamp-3'}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {job.description}
            </ReactMarkdown>
          </div>
          {job.description && job.description.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-1"
            >
              {expanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(expanded ? job.skills : job.skills.slice(0, 5)).map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {skill}
              </span>
            ))}
            {job.skills.length > 5 && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium hover:bg-primary-100"
              >
                +{job.skills.length - 5} more
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            Posted {formatDate(job.createdAt || job.created_at)}
          </span>

          {/* Posted By */}
          {job.postedBy && (
            <span className="text-sm text-gray-500">
              By {job.postedBy.name || job.postedBy.full_name}
            </span>
          )}
        </div>

        {/* Apply Button */}
        <a
          href={job.applicationLink || job.application_link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onApply && onApply(job)}
          className="w-full btn-primary mt-4 flex items-center justify-center gap-2"
        >
          Apply Now
          <FiExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default JobCard;
