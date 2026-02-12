import { FiMapPin, FiBriefcase, FiCalendar, FiExternalLink, FiMail } from 'react-icons/fi';

const AlumniCard = ({ alumni, onClick }) => {
  // Debug: Log the alumni data structure
  console.log('AlumniCard - Alumni data received:', alumni);
  
  // Extract user data from top level (snake_case or camelCase)
  const firstName = alumni.first_name || alumni.firstName || '';
  const lastName = alumni.last_name || alumni.lastName || '';
  const fullName = alumni.full_name || alumni.fullName || `${firstName} ${lastName}`.trim() || 'Alumni';
  const email = alumni.email || '';
  const avatar = alumni.avatar || '';
  const department = alumni.department || '';
  
  // Profile data is nested under 'profile' key from backend
  const profile = alumni.profile || alumni;
  const bio = profile.bio || '';
  const currentPosition = profile.current_designation || profile.currentDesignation || profile.currentPosition || '';
  const company = profile.current_company || profile.currentCompany || profile.company || '';
  const location = profile.current_location || profile.currentLocation || profile.location || '';
  const graduationYear = profile.graduation_year || profile.graduationYear || '';
  const skills = profile.expertise_areas || profile.expertiseAreas || profile.skills || [];
  const linkedIn = profile.social_profiles?.linkedin || profile.socialProfiles?.linkedin || profile.linkedIn || '';
  
  console.log('AlumniCard - Extracted:', {
    fullName,
    currentPosition,
    company,
    location,
    email,
    department
  });
  
  return (
    <div
      className="card-hover cursor-pointer"
      onClick={() => onClick && onClick(alumni)}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={fullName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-primary-600">
              {firstName?.[0]?.toUpperCase() || 'A'}{lastName?.[0]?.toUpperCase() || 'U'}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {fullName}
          </h3>
          {currentPosition && (
            <p className="text-sm text-primary-600 font-medium">
              {currentPosition}
            </p>
          )}
          
          {!currentPosition && department && (
            <p className="text-sm text-gray-500">
              {department}
            </p>
          )}

          <div className="mt-2 space-y-1">
            {company && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiBriefcase className="w-4 h-4" />
                <span className="truncate">{company}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiMapPin className="w-4 h-4" />
                <span className="truncate">{location}</span>
              </div>
            )}
            {graduationYear && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiCalendar className="w-4 h-4" />
                <span>Class of {graduationYear}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="badge-primary">
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {linkedIn && (
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
            >
              <FiExternalLink className="w-4 h-4" />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
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


