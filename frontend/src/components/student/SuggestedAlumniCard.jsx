import { FiMapPin, FiBriefcase, FiMail, FiMessageCircle } from 'react-icons/fi';

const SuggestedAlumniCard = ({ alumni, matchReason }) => {
  // Debug: Log the FULL alumni data structure
  console.log('=== SuggestedAlumniCard - Full Alumni Object ===', alumni);
  console.log('Top-level keys:', Object.keys(alumni));
  if (alumni.profile) {
    console.log('Profile keys:', Object.keys(alumni.profile));
  }
  
  // Extract profile data - backend returns nested structure
  const firstName = alumni.first_name || alumni.firstName || '';
  const lastName = alumni.last_name || alumni.lastName || '';
  const fullName = alumni.full_name || alumni.fullName || `${firstName} ${lastName}`.trim();
  const email = alumni.email || '';
  const avatar = alumni.avatar || '';
  const department = alumni.department || '';
  
  // Profile data is nested under 'profile' key from backend
  const profile = alumni.profile || alumni;
  const bio = profile.bio || '';
  const currentPosition = profile.current_designation || profile.currentDesignation || profile.currentPosition || profile.jobTitle || '';
  const company = profile.current_company || profile.currentCompany || profile.company || '';
  const location = profile.current_location || profile.currentLocation || profile.location || '';
  const graduationYear = profile.graduation_year || profile.graduationYear || '';
  const experienceYears = profile.experience_years || profile.experienceYears || '';
  
  console.log('=== Extracted Values ===');
  console.log('firstName:', firstName);
  console.log('lastName:', lastName);
  console.log('fullName:', fullName);
  console.log('email:', email);
  console.log('currentPosition:', currentPosition);
  console.log('company:', company);
  console.log('location:', location);
  console.log('bio:', bio);
  console.log('========================');
  
  // Only show "Alumni" as fallback if we truly have no name
  const displayName = fullName || 'Alumni';
  
  return (
    <div className="card-hover">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-primary-600">
              {firstName?.[0]?.toUpperCase() || 'A'}{lastName?.[0]?.toUpperCase() || 'U'}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">
            {displayName}
          </h3>
          {!fullName && department && (
            <p className="text-sm text-gray-500">
              {department}
            </p>
          )}
          {currentPosition && (
            <p className="text-sm text-primary-600 font-medium">
              {currentPosition}
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
              <div className="text-xs text-gray-400">
                Class of {graduationYear}
              </div>
            )}
          </div>
          
          {/* Bio/About */}
          {bio && (
            <p className="mt-2 text-xs text-gray-600 line-clamp-2">
              {bio}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        {email ? (
          <a 
            href={`mailto:${email}`}
            className="flex-1 btn-secondary flex items-center justify-center gap-2 py-2"
          >
            <FiMail className="w-4 h-4" />
            <span>Email</span>
          </a>
        ) : (
          <button 
            disabled
            className="flex-1 btn-secondary flex items-center justify-center gap-2 py-2 opacity-50 cursor-not-allowed"
          >
            <FiMail className="w-4 h-4" />
            <span>Email</span>
          </button>
        )}
        <button className="flex-1 btn-primary flex items-center justify-center gap-2 py-2">
          <FiMessageCircle className="w-4 h-4" />
          <span>Connect</span>
        </button>
      </div>
    </div>
  );
};

export default SuggestedAlumniCard;

