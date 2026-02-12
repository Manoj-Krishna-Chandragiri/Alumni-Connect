import { useState, useEffect } from 'react';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiLinkedin, FiGithub, 
  FiGlobe, FiInstagram, FiTwitter, FiBriefcase, FiPlus, FiTrash2,
  FiAward, FiBookOpen, FiCalendar
} from 'react-icons/fi';
import { SiFacebook } from 'react-icons/si';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import RollNumberInput from '../shared/RollNumberInput';
import FileUpload from '../shared/FileUpload';

const AlumniProfileEditForm = ({ profile, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    rollNumber: profile?.rollNumber || '',
    profilePicture: profile?.profilePicture || null,
    
    // Professional Details
    currentPosition: profile?.currentPosition || '',
    currentCompany: profile?.currentCompany || '',
    yearsOfExperience: profile?.yearsOfExperience ? parseFloat(profile.yearsOfExperience) : '',
    industry: profile?.industry || '',
    resume: profile?.resume || null,
    
    // Academic Details
    graduationYear: profile?.graduationYear || '',
    department: profile?.department || '',
    
    // Social Profiles
    socialProfiles: {
      linkedin: profile?.socialProfiles?.linkedin || '',
      github: profile?.socialProfiles?.github || '',
      twitter: profile?.socialProfiles?.twitter || '',
      instagram: profile?.socialProfiles?.instagram || '',
      facebook: profile?.socialProfiles?.facebook || '',
      portfolio: profile?.socialProfiles?.portfolio || '',
    },
    
    // Work Experience
    workExperience: profile?.workExperience || [],
    
    // Higher Education
    higherEducation: profile?.higherEducation || [],
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [rollNumberValid, setRollNumberValid] = useState(true);

  // Update form data when profile prop changes
  useEffect(() => {
    if (profile) {
      console.log('Profile data received:', profile);
      console.log('Work experience from profile:', profile?.workExperience);
      
      setFormData({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        bio: profile?.bio || '',
        location: profile?.location || '',
        rollNumber: profile?.rollNumber || '',
        profilePicture: profile?.profilePicture || null,
        currentPosition: profile?.currentPosition || profile?.currentDesignation || '',
        currentCompany: profile?.currentCompany || '',
        yearsOfExperience: profile?.yearsOfExperience ? parseFloat(profile.yearsOfExperience) : '',
        industry: profile?.industry || '',
        resume: profile?.resume || null,
        graduationYear: profile?.graduationYear || '',
        department: profile?.department || '',
        socialProfiles: {
          linkedin: profile?.socialProfiles?.linkedin || '',
          github: profile?.socialProfiles?.github || '',
          twitter: profile?.socialProfiles?.twitter || '',
          instagram: profile?.socialProfiles?.instagram || '',
          facebook: profile?.socialProfiles?.facebook || '',
          portfolio: profile?.socialProfiles?.portfolio || '',
        },
        workExperience: profile?.workExperience || [],
        higherEducation: profile?.higherEducation || [],
      });
    }
  }, [profile]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialProfileChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialProfiles: {
        ...prev.socialProfiles,
        [platform]: value
      }
    }));
  };

  const handleAddWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, { 
        company: '', 
        position: '', 
        startDate: '', 
        endDate: '',
        isCurrent: false,
        description: '',
        location: ''
      }]
    }));
  };

  const handleRemoveWorkExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const handleWorkExperienceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) => {
        if (i === index) {
          const updated = { ...exp, [field]: value };
          // Clear endDate when marking as current role
          if (field === 'isCurrent' && value === true) {
            updated.endDate = '';
          }
          return updated;
        }
        return exp;
      })
    }));
  };

  // Helper to parse DD-MM-YYYY to Date object
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return new Date(year, month - 1, day);
    }
    return null;
  };

  // Helper to format Date object to DD-MM-YYYY
  const formatDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      higherEducation: [...prev.higherEducation, { 
        degree: '', 
        institution: '', 
        startYear: '', 
        endYear: '',
        fieldOfStudy: '',
        mode: 'regular'
      }]
    }));
  };

  const handleRemoveEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      higherEducation: prev.higherEducation.filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      higherEducation: prev.higherEducation.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert empty yearsOfExperience to 0 or parseFloat
    const submitData = {
      ...formData,
      yearsOfExperience: formData.yearsOfExperience === '' ? 0 : parseFloat(formData.yearsOfExperience) || 0
    };
    onSave(submitData);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: FiUser },
    { id: 'professional', label: 'Professional Details', icon: FiBriefcase },
    { id: 'social', label: 'Social Profiles', icon: FiLinkedin },
    { id: 'experience', label: 'Work Experience', icon: FiBriefcase },
    { id: 'education', label: 'Higher Education', icon: FiBookOpen },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <div>
              <FileUpload
                label="Profile Picture"
                accept="image/*"
                maxSize={5}
                value={formData.profilePicture}
                onChange={(file) => handleChange('profilePicture', file)}
                showPreview={true}
                helperText="Upload a profile picture (Max 5MB, JPG/PNG)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="input pl-10"
                  required
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="input pl-10"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="input pl-10"
                  placeholder="City, State, Country"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roll Number <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <RollNumberInput
                value={formData.rollNumber}
                onChange={(value) => handleChange('rollNumber', value)}
                onValidationChange={setRollNumberValid}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="input"
                rows={4}
                placeholder="Tell us about your professional journey..."
              />
            </div>
          </div>
        )}

        {/* Professional Details Tab */}
        {activeTab === 'professional' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.currentPosition}
                onChange={(e) => handleChange('currentPosition', e.target.value)}
                className="input"
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.currentCompany}
                onChange={(e) => handleChange('currentCompany', e.target.value)}
                className="input"
                placeholder="e.g., Google"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.yearsOfExperience || ''}
                onChange={(e) => handleChange('yearsOfExperience', e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="input"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                className="input"
              >
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Consulting">Consulting</option>
                <option value="Government">Government</option>
                <option value="Startup">Startup</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation Year
                </label>
                <input
                  type="number"
                  min="1990"
                  max="2030"
                  value={formData.graduationYear}
                  onChange={(e) => handleChange('graduationYear', parseInt(e.target.value))}
                  className="input"
                  placeholder="2020"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  className="input bg-gray-50"
                  disabled
                />
              </div>
            </div>

            <div>
              <FileUpload
                label="Resume/CV"
                accept=".pdf,.doc,.docx"
                maxSize={5}
                value={formData.resume}
                onChange={(file) => handleChange('resume', file)}
                showPreview={true}
                helperText="Upload your latest resume (Max 5MB, PDF/DOC/DOCX)"
              />
            </div>
          </div>
        )}

        {/* Social Profiles Tab */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Add your social media and professional profiles. LinkedIn is mandatory for networking.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiLinkedin className="inline w-4 h-4 mr-1" />
                LinkedIn <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.socialProfiles.linkedin}
                onChange={(e) => handleSocialProfileChange('linkedin', e.target.value)}
                className="input"
                placeholder="https://linkedin.com/in/yourprofile"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiGithub className="inline w-4 h-4 mr-1" />
                GitHub
              </label>
              <input
                type="url"
                value={formData.socialProfiles.github}
                onChange={(e) => handleSocialProfileChange('github', e.target.value)}
                className="input"
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiGlobe className="inline w-4 h-4 mr-1" />
                Portfolio / Personal Website
              </label>
              <input
                type="url"
                value={formData.socialProfiles.portfolio}
                onChange={(e) => handleSocialProfileChange('portfolio', e.target.value)}
                className="input"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiTwitter className="inline w-4 h-4 mr-1" />
                Twitter
              </label>
              <input
                type="url"
                value={formData.socialProfiles.twitter}
                onChange={(e) => handleSocialProfileChange('twitter', e.target.value)}
                className="input"
                placeholder="https://twitter.com/yourusername"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiInstagram className="inline w-4 h-4 mr-1" />
                Instagram
              </label>
              <input
                type="url"
                value={formData.socialProfiles.instagram}
                onChange={(e) => handleSocialProfileChange('instagram', e.target.value)}
                className="input"
                placeholder="https://instagram.com/yourusername"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SiFacebook className="inline w-4 h-4 mr-1" />
                Facebook
              </label>
              <input
                type="url"
                value={formData.socialProfiles.facebook}
                onChange={(e) => handleSocialProfileChange('facebook', e.target.value)}
                className="input"
                placeholder="https://facebook.com/yourprofile"
              />
            </div>
          </div>
        )}

        {/* Work Experience Tab */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Add your complete work history
              </p>
              <button
                type="button"
                onClick={handleAddWorkExperience}
                className="btn-primary flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add Experience
              </button>
            </div>

            {formData.workExperience.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No work experience added yet. Click "Add Experience" to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {formData.workExperience.map((exp, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveWorkExperience(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                        className="input"
                        placeholder="Company name"
                        required
                      />
                      <input
                        type="text"
                        value={exp.position || ''}
                        onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                        className="input"
                        placeholder="Position/Title"
                        required
                      />
                      <input
                        type="text"
                        value={exp.location || ''}
                        onChange={(e) => handleWorkExperienceChange(index, 'location', e.target.value)}
                        className="input"
                        placeholder="Location"
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exp.isCurrent || false}
                            onChange={(e) => handleWorkExperienceChange(index, 'isCurrent', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">Current Role</span>
                        </label>
                      </div>
                      <div>
                        <DatePicker
                          selected={parseDate(exp.startDate)}
                          onChange={(date) => handleWorkExperienceChange(index, 'startDate', formatDate(date))}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="Start Date (DD-MM-YYYY)"
                          className="input w-full"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          maxDate={new Date()}
                          wrapperClassName="w-full"
                        />
                      </div>
                      <div>
                        <DatePicker
                          selected={parseDate(exp.endDate)}
                          onChange={(date) => handleWorkExperienceChange(index, 'endDate', formatDate(date))}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="End Date (DD-MM-YYYY)"
                          className="input w-full"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          maxDate={new Date()}
                          minDate={parseDate(exp.startDate)}
                          disabled={exp.isCurrent}
                          wrapperClassName="w-full"
                        />
                      </div>
                    </div>
                    <textarea
                      value={exp.description || ''}
                      onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                      className="input"
                      rows={3}
                      placeholder="Describe your responsibilities, achievements, and key contributions..."
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Higher Education Tab */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Add your higher education (MS, MTech, PhD, etc.)
              </p>
              <button
                type="button"
                onClick={handleAddEducation}
                className="btn-primary flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add Education
              </button>
            </div>

            {formData.higherEducation.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No higher education added yet. Click "Add Education" to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {formData.higherEducation.map((edu, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="input"
                        required
                      >
                        <option value="">Select Degree</option>
                        <option value="MS">MS (Master of Science)</option>
                        <option value="MTech">MTech (Master of Technology)</option>
                        <option value="MBA">MBA (Master of Business Administration)</option>
                        <option value="PhD">PhD (Doctor of Philosophy)</option>
                        <option value="Other">Other</option>
                      </select>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        className="input"
                        placeholder="Institution/University"
                        required
                      />
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                        className="input"
                        placeholder="Field of Study"
                      />
                      <select
                        value={edu.mode}
                        onChange={(e) => handleEducationChange(index, 'mode', e.target.value)}
                        className="input"
                      >
                        <option value="regular">Regular (Full-time)</option>
                        <option value="online">Online</option>
                        <option value="part-time">Part-time</option>
                        <option value="distance">Distance Learning</option>
                      </select>
                      <input
                        type="number"
                        min="1990"
                        max="2035"
                        value={edu.startYear}
                        onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
                        className="input"
                        placeholder="Start Year"
                      />
                      <input
                        type="number"
                        min="1990"
                        max="2035"
                        value={edu.endYear}
                        onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
                        className="input"
                        placeholder="End Year"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary px-6"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-6 flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
};

export default AlumniProfileEditForm;
