import { FiMapPin, FiBriefcase, FiCalendar, FiExternalLink, FiMail } from 'react-icons/fi';

const AlumniCard = ({ alumni, onClick }) => {
  return (
    <div
      className="card-hover cursor-pointer"
      onClick={() => onClick && onClick(alumni)}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          {alumni.avatar ? (
            <img
              src={alumni.avatar}
              alt={alumni.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-primary-600">
              {alumni.firstName?.[0]}{alumni.lastName?.[0]}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {alumni.firstName} {alumni.lastName}
          </h3>
          <p className="text-sm text-primary-600 font-medium">
            {alumni.currentPosition}
          </p>

          <div className="mt-2 space-y-1">
            {alumni.company && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiBriefcase className="w-4 h-4" />
                <span className="truncate">{alumni.company}</span>
              </div>
            )}
            {alumni.location && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiMapPin className="w-4 h-4" />
                <span className="truncate">{alumni.location}</span>
              </div>
            )}
            {alumni.graduationYear && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiCalendar className="w-4 h-4" />
                <span>Class of {alumni.graduationYear}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {alumni.skills && alumni.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {alumni.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="badge-primary">
                  {skill}
                </span>
              ))}
              {alumni.skills.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{alumni.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {alumni.linkedIn && (
            <a
              href={alumni.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
            >
              <FiExternalLink className="w-4 h-4" />
            </a>
          )}
          {alumni.email && (
            <a
              href={`mailto:${alumni.email}`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <FiMail className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniCard;
