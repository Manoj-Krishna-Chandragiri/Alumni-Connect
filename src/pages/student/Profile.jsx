import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import studentApi from '../../api/student.api';
import { Loader, ErrorAlert } from '../../components/shared';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiExternalLink,
  FiCode,
  FiGlobe,
  FiBook,
  FiBriefcase,
  FiAward,
  FiEdit2,
  FiSave,
  FiX,
} from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getProfile();
      setProfile(response.data);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      await studentApi.updateProfile(formData);
      setProfile(formData);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditMode(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: FiUser },
    { id: 'social', label: 'Social Links', icon: FiExternalLink },
    { id: 'education', label: 'Education', icon: FiBook },
    { id: 'experience', label: 'Experience', icon: FiBriefcase },
    { id: 'skills', label: 'Skills & Certifications', icon: FiAward },
  ];

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
          <p className="text-gray-500">Manage your personal information</p>
        </div>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiEdit2 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="btn-secondary flex items-center gap-2"
            >
              <FiX className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <Loader size="sm" color="white" />
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Alerts */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          {success}
        </div>
      )}

      {/* Profile Header Card */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-primary-600">
              {profile?.firstName?.[0]}{profile?.lastName?.[0]}
            </span>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-900">
              {profile?.firstName} {profile?.lastName}
            </h2>
            <p className="text-gray-500">{profile?.department}</p>
            <p className="text-sm text-gray-400">
              Expected Graduation: {profile?.graduationYear}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="card">
        {/* Personal Info */}
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                disabled={!editMode}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                disabled={!editMode}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!editMode}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!editMode}
                className="input"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                disabled={!editMode}
                rows={4}
                className="input"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        )}

        {/* Social Links */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiExternalLink className="inline w-4 h-4 mr-2" />
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedIn || ''}
                onChange={(e) => handleChange('linkedIn', e.target.value)}
                disabled={!editMode}
                className="input"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCode className="inline w-4 h-4 mr-2" />
                GitHub
              </label>
              <input
                type="url"
                value={formData.github || ''}
                onChange={(e) => handleChange('github', e.target.value)}
                disabled={!editMode}
                className="input"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiGlobe className="inline w-4 h-4 mr-2" />
                Portfolio Website
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                disabled={!editMode}
                className="input"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        )}

        {/* Education */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={(e) => handleChange('department', e.target.value)}
                  disabled={!editMode}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roll Number
                </label>
                <input
                  type="text"
                  value={formData.rollNumber || ''}
                  disabled
                  className="input bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation Year
                </label>
                <input
                  type="number"
                  value={formData.graduationYear || ''}
                  onChange={(e) => handleChange('graduationYear', e.target.value)}
                  disabled={!editMode}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CGPA
                </label>
                <input
                  type="text"
                  value={formData.cgpa || ''}
                  onChange={(e) => handleChange('cgpa', e.target.value)}
                  disabled={!editMode}
                  className="input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">
              Add your internships and work experience
            </p>
            {formData.experience?.length > 0 ? (
              formData.experience.map((exp, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium">{exp.title}</h4>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-400">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No experience added yet
              </div>
            )}
            {editMode && (
              <button className="btn-secondary w-full">+ Add Experience</button>
            )}
          </div>
        )}

        {/* Skills & Certifications */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.skills?.map((skill, index) => (
                  <span key={index} className="badge-primary">
                    {skill}
                    {editMode && (
                      <button className="ml-1 text-primary-800 hover:text-primary-900">
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {editMode && (
                <input
                  type="text"
                  className="input mt-2"
                  placeholder="Add a skill and press Enter"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications
              </label>
              {formData.certifications?.length > 0 ? (
                formData.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-lg mb-2"
                  >
                    <h4 className="font-medium">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-400">{cert.date}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No certifications added yet
                </div>
              )}
              {editMode && (
                <button className="btn-secondary w-full mt-2">
                  + Add Certification
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
