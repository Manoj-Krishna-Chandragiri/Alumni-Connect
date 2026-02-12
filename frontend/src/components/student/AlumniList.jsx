import { useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiBriefcase, FiLinkedin } from 'react-icons/fi';

const AlumniList = ({ alumni, onClick }) => {
  const navigate = useNavigate();

  const handleRowClick = (alumniItem) => {
    if (onClick) {
      onClick(alumniItem);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
        <div className="col-span-4">Name</div>
        <div className="col-span-2">Graduation Year</div>
        <div className="col-span-3">Department</div>
        <div className="col-span-2">Current Company</div>
        <div className="col-span-1 text-center">Profile</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {alumni.map((alumniItem) => (
          <div
            key={alumniItem.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleRowClick(alumniItem)}
          >
            {/* Name with Avatar */}
            <div className="col-span-1 md:col-span-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                {alumniItem.user?.avatar ? (
                  <img
                    src={alumniItem.user.avatar}
                    alt={alumniItem.user?.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="w-5 h-5 text-primary-600" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {alumniItem.user?.full_name || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {alumniItem.current_position || 'N/A'}
                </p>
              </div>
            </div>

            {/* Graduation Year */}
            <div className="col-span-1 md:col-span-2 flex items-center">
              <div className="md:block">
                <span className="md:hidden text-sm font-medium text-gray-700 mr-2">Year:</span>
                <span className="text-sm text-gray-900 font-medium">
                  {alumniItem.graduation_year || 'N/A'}
                </span>
              </div>
            </div>

            {/* Department */}
            <div className="col-span-1 md:col-span-3 flex items-center">
              <div>
                <span className="md:hidden text-sm font-medium text-gray-700 mr-2">Dept:</span>
                <span className="text-sm text-gray-700">
                  {alumniItem.department || 'N/A'}
                </span>
              </div>
            </div>

            {/* Current Company */}
            <div className="col-span-1 md:col-span-2 flex items-center gap-2">
              <div className="flex items-center gap-2">
                <FiBriefcase className="w-4 h-4 text-gray-400 md:hidden" />
                <span className="text-sm text-gray-600 truncate">
                  {alumniItem.current_company || 'N/A'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-1 md:col-span-1 flex items-center justify-start md:justify-center gap-2">
              {alumniItem.social_profiles?.linkedin && (
                <a
                  href={alumniItem.social_profiles.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                  title="LinkedIn Profile"
                >
                  <FiLinkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumniList;
