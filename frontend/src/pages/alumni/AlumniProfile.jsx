import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import alumniApi from '../../api/alumni.api';
import { AlumniProfileEditForm } from '../../components/alumni';
import { Loader, ErrorAlert } from '../../components/shared';
import { 
  FiEdit2, FiMail, FiPhone, FiMapPin, FiLinkedin, 
  FiGithub, FiGlobe, FiBriefcase, FiAward 
} from 'react-icons/fi';

const AlumniProfile = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await alumniApi.getProfile();
      console.log('Raw API response:', response);
      console.log('Profile data:', response.data);
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      setError('');
      console.log('Saving form data:', formData);
      console.log('Work experience being saved:', formData.workExperience);
      await alumniApi.updateProfile(formData);
      const response = await alumniApi.getProfile();
      const updatedProfile = response.data;
      console.log('Updated profile received:', updatedProfile);
      console.log('Work experience in updated profile:', updatedProfile.workExperience);
      setProfile(updatedProfile);
      updateProfile(updatedProfile); // Update in AuthContext
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500">Manage your alumni information</p>
        </div>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiEdit2 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          {success}
        </div>
      )}

      {/* Edit Mode */}
      {editMode ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <AlumniProfileEditForm
            profile={profile}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={saving}
          />
        </div>
      ) : (
        /* View Mode */
        <>
          {/* Profile Header Card */}
          <div className="card">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {profile?.profilePicture ? (
                <img 
                  src={profile.profilePicture} 
                  alt={`${profile?.firstName} ${profile?.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
                />
              ) : (
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-600">
                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                  </span>
                </div>
              )}
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                {profile?.currentPosition && profile?.currentCompany ? (
                  <p className="text-gray-600 font-medium">
                    {profile.currentPosition} at {profile.currentCompany}
                  </p>
                ) : (
                  <p className="text-gray-600 font-medium">{profile?.department}</p>
                )}
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                  {profile?.rollNumber && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Roll:</span> {profile.rollNumber}
                    </div>
                  )}
                  {profile?.graduationYear && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Graduated:</span> {profile.graduationYear}
                    </div>
                  )}
                  {profile?.yearsOfExperience && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Experience:</span> {profile.yearsOfExperience} years
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {profile?.email && (
                <div className="flex items-center gap-3">
                  <FiMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{profile.email}</p>
                  </div>
                </div>
              )}
              {profile?.phone && (
                <div className="flex items-center gap-3">
                  <FiPhone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{profile.phone}</p>
                  </div>
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center gap-3">
                  <FiMapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{profile.location}</p>
                  </div>
                </div>
              )}
              {profile?.industry && (
                <div className="flex items-center gap-3">
                  <FiBriefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="text-gray-900">{profile.industry}</p>
                  </div>
                </div>
              )}
            </div>
            {profile?.bio && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Bio</p>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}
          </div>

          {/* Social Profiles */}
          {profile?.socialProfiles && Object.values(profile.socialProfiles).some(v => v) && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Profiles</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {profile.socialProfiles.linkedin && (
                  <a href={profile.socialProfiles.linkedin} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <FiLinkedin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                )}
                {profile.socialProfiles.github && (
                  <a href={profile.socialProfiles.github} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <FiGithub className="w-5 h-5 text-gray-900" />
                    <span className="text-sm font-medium">GitHub</span>
                  </a>
                )}
                {profile.socialProfiles.portfolio && (
                  <a href={profile.socialProfiles.portfolio} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <FiGlobe className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium">Portfolio</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {profile?.workExperience && profile.workExperience.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
              <div className="space-y-4">
                {profile.workExperience.map((work, index) => {
                  const formatDate = (date) => {
                    if (!date) return '';
                    // Handle DD-MM-YYYY format
                    const parts = date.split('-');
                    if (parts.length === 3) {
                      const [day, month, year] = parts;
                      return new Date(year, parseInt(month) - 1, day).toLocaleDateString('en-US', { 
                        day: 'numeric',
                        month: 'short', 
                        year: 'numeric' 
                      });
                    }
                    return date;
                  };
                  
                  return (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                    {work.isCurrent && (
                      <span className="absolute top-3 right-3 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Current
                      </span>
                    )}
                    <h4 className="font-semibold text-gray-900">{work.position}</h4>
                    <p className="text-gray-600 font-medium">{work.company}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      {(work.startDate || work.endDate) && (
                        <span>
                          {formatDate(work.startDate) || 'Start date'} - {work.isCurrent ? 'Present' : (formatDate(work.endDate) || 'End date')}
                        </span>
                      )}
                      {work.location && (
                        <>
                          {(work.startDate || work.endDate) && <span>•</span>}
                          <span>{work.location}</span>
                        </>
                      )}
                    </div>
                    {work.description && (
                      <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{work.description}</p>
                    )}
                  </div>
                );
                })}
              </div>
            </div>
          )}

          {/* Higher Education */}
          {profile?.higherEducation && profile.higherEducation.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiAward className="w-5 h-5" />
                Higher Education
              </h3>
              <div className="space-y-3">
                {profile.higherEducation.map((edu, index) => (
                  <div key={index} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {edu.fieldOfStudy}
                          {edu.mode && edu.mode !== 'regular' && (
                            <span className="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                              {edu.mode}
                            </span>
                          )}
                        </p>
                      </div>
                      {edu.startYear && (
                        <span className="text-sm text-gray-500">
                          {edu.startYear} - {edu.endYear || 'Present'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Academic Background */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Background</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {profile?.department && (
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="text-gray-900 font-medium">{profile.department}</p>
                </div>
              )}
              {profile?.graduationYear && (
                <div>
                  <p className="text-sm text-gray-500">Graduation Year</p>
                  <p className="text-gray-900 font-medium">{profile.graduationYear}</p>
                </div>
              )}
              {profile?.rollNumber && (
                <div>
                  <p className="text-sm text-gray-500">Roll Number</p>
                  <p className="text-gray-900 font-medium">{profile.rollNumber}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AlumniProfile;
