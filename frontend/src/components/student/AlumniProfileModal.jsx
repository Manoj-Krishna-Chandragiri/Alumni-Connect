import {
  FiX,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiExternalLink,
  FiMail,
  FiPhone,
  FiGlobe,
  FiCode,
} from 'react-icons/fi';

const AlumniProfileModal = ({ isOpen, onClose, alumni }) => {
  if (!isOpen || !alumni) return null;

  // Extract user data from top level (snake_case or camelCase)
  const firstName = alumni.first_name || alumni.firstName || '';
  const lastName = alumni.last_name || alumni.lastName || '';
  const fullName = alumni.full_name || alumni.fullName || `${firstName} ${lastName}`;
  const email = alumni.email || '';
  const avatar = alumni.avatar || '';
  const department = alumni.department || '';
  
  // Profile data is nested under 'profile' key from backend
  const profile = alumni.profile || alumni;
  const currentPosition = profile.current_designation || profile.currentDesignation || profile.currentPosition || '';
  const company = profile.current_company || profile.currentCompany || profile.company || '';
  const location = profile.current_location || profile.currentLocation || profile.location || '';
  const graduationYear = profile.graduation_year || profile.graduationYear || '';
  const bio = profile.bio || profile.about || '';
  const skills = profile.expertise_areas || profile.expertiseAreas || profile.skills || [];
  const experience = profile.work_experience || profile.workExperience || profile.experience || [];
  
  // Social profiles
  const socialProfiles = profile.social_profiles || profile.socialProfiles || {};
  const linkedIn = socialProfiles.linkedin || profile.linkedIn || '';
  const github = socialProfiles.github || profile.github || '';
  const website = socialProfiles.portfolio || profile.website || '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 z-10"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={fullName}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold">
                    {firstName?.[0] || 'A'}{lastName?.[0] || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {fullName || 'Alumni'}
                </h2>
                {currentPosition && (
                  <p className="text-primary-100">{currentPosition}</p>
                )}
                {company && (
                  <p className="text-primary-200 text-sm">{company}</p>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              {location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMapPin className="w-4 h-4 text-gray-400" />
                  <span>{location}</span>
                </div>
              )}
              {graduationYear && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FiCalendar className="w-4 h-4 text-gray-400" />
                  <span>Class of {graduationYear}</span>
                </div>
              )}
              {department && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FiBriefcase className="w-4 h-4 text-gray-400" />
                  <span>{department}</span>
                </div>
              )}
            </div>

            {/* About */}
            {bio && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600">{bio}</p>
              </div>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Experience</h3>
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-primary-200 pl-4"
                    >
                      <h4 className="font-medium text-gray-900">
                        {exp.position || exp.title || 'Position'}
                      </h4>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-xs text-gray-400">
                        {exp.startDate || exp.start_date || ''} - {exp.isCurrent || exp.is_current ? 'Present' : (exp.endDate || exp.end_date || 'End')}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="badge-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Connect</h3>
              <div className="flex flex-wrap gap-3">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    <FiMail className="w-4 h-4" />
                    <span>Email</span>
                  </a>
                )}
                {linkedIn && (
                  <a
                    href={linkedIn.startsWith('http') ? linkedIn : `https://linkedin.com/in/${linkedIn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {github && (
                  <a
                    href={github.startsWith('http') ? github : `https://github.com/${github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900"
                  >
                    <FiCode className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
                {website && (
                  <a
                    href={website.startsWith('http') ? website : `https://${website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200"
                  >
                    <FiGlobe className="w-4 h-4" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniProfileModal;

