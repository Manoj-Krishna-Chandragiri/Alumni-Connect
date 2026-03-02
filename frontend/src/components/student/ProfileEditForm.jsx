import { useState, useEffect } from 'react';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiLinkedin, FiGithub, 
  FiGlobe, FiInstagram, FiTwitter, FiCode, FiPlus, FiTrash2,
  FiAward, FiBriefcase, FiBookOpen, FiTrendingUp
} from 'react-icons/fi';
import { SiLeetcode, SiCodechef, SiFacebook } from 'react-icons/si';
import RollNumberInput from '../shared/RollNumberInput';
import FileUpload from '../shared/FileUpload';
import { BRANCH_FULL_NAMES, parseRollNumber } from '../../utils/rollNumberUtils';

const ProfileEditForm = ({ profile, onSave, onCancel, loading }) => {
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
    
    // Academic Details
    currentYear: profile?.currentYear || 1,
    currentSemester: profile?.currentSemester || 1,
    cgpa: profile?.cgpa || '',
    department: profile?.department || '',
    resume: profile?.resume || null,
    
    // Social Profiles
    socialProfiles: {
      linkedin: profile?.socialProfiles?.linkedin || '',
      github: profile?.socialProfiles?.github || '',
      twitter: profile?.socialProfiles?.twitter || '',
      instagram: profile?.socialProfiles?.instagram || '',
      facebook: profile?.socialProfiles?.facebook || '',
      portfolio: profile?.socialProfiles?.portfolio || '',
      leetcode: profile?.socialProfiles?.leetcode || '',
      codechef: profile?.socialProfiles?.codechef || '',
    },
    
    // Skills
    skills: profile?.skills || [],
    
    // Certifications
    certifications: profile?.certifications || [],
    
    // Internships
    internships: profile?.internships || [],
    
    // Placements
    placements: profile?.placements || [],
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [rollNumberValid, setRollNumberValid] = useState(true);
  const [parsedRollInfo, setParsedRollInfo] = useState(null);

  // Update form data when profile prop changes
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        bio: profile?.bio || '',
        location: profile?.location || '',
        rollNumber: profile?.rollNumber || '',
        profilePicture: profile?.profilePicture || null,
        currentYear: profile?.currentYear || 1,
        currentSemester: profile?.currentSemester || 1,
        cgpa: profile?.cgpa || '',
        department: profile?.department || '',
        resume: profile?.resume || null,
        socialProfiles: {
          linkedin: profile?.socialProfiles?.linkedin || '',
          github: profile?.socialProfiles?.github || '',
          twitter: profile?.socialProfiles?.twitter || '',
          instagram: profile?.socialProfiles?.instagram || '',
          facebook: profile?.socialProfiles?.facebook || '',
          portfolio: profile?.socialProfiles?.portfolio || '',
          leetcode: profile?.socialProfiles?.leetcode || '',
          codechef: profile?.socialProfiles?.codechef || '',
        },
        skills: profile?.skills || [],
        certifications: profile?.certifications || [],
        internships: profile?.internships || [],
        placements: profile?.placements || [],
      });
      
      // Parse roll number on initial load
      if (profile?.rollNumber) {
        const parsed = parseRollNumber(profile.rollNumber);
        if (parsed) {
          setParsedRollInfo(parsed);
        }
      }
    }
  }, [profile]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRollNumberChange = (value) => {
    // Update roll number
    setFormData(prev => ({ ...prev, rollNumber: value }));
    
    // Parse roll number and auto-populate department with SHORT code (CSM, CSE, etc.)
    const parsed = parseRollNumber(value);
    if (parsed && parsed.branchShort) {
      // Store parsed info for display
      setParsedRollInfo(parsed);
      // Store short code in lowercase to match backend format
      setFormData(prev => ({ ...prev, department: parsed.branchShort.toLowerCase() }));
    } else {
      setParsedRollInfo(null);
    }
  };

  // Get display department name
  const getDepartmentDisplay = () => {
    // First try to get from parsed roll number
    if (parsedRollInfo && parsedRollInfo.branchFull) {
      return parsedRollInfo.branchFull;
    }
    // Try to parse current roll number
    if (formData.rollNumber) {
      const parsed = parseRollNumber(formData.rollNumber);
      if (parsed && parsed.branchFull) {
        return parsed.branchFull;
      }
    }
    // Fallback to stored department code
    if (formData.department) {
      const deptUpper = formData.department.toUpperCase();
      return BRANCH_FULL_NAMES[deptUpper] || formData.department;
    }
    return 'Not specified';
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

  const handleAddSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', proficiency: 'beginner' }]
    }));
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSkillChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const handleAddCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { 
        name: '', 
        issuer: '', 
        issueDate: '', 
        expiryDate: '',
        credentialId: '',
        score: '',
        file: null,
      }]
    }));
  };

  const handleRemoveCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleCertificationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const handleAddInternship = () => {
    setFormData(prev => ({
      ...prev,
      internships: [...prev.internships, { 
        company: '', 
        role: '', 
        startDate: '', 
        endDate: '',
        description: '',
        isPaid: false
      }]
    }));
  };

  const handleRemoveInternship = (index) => {
    setFormData(prev => ({
      ...prev,
      internships: prev.internships.filter((_, i) => i !== index)
    }));
  };

  const handleInternshipChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      internships: prev.internships.map((intern, i) => 
        i === index ? { ...intern, [field]: value } : intern
      )
    }));
  };

  const handleAddPlacement = () => {
    setFormData(prev => ({
      ...prev,
      placements: [...prev.placements, { 
        company: '', 
        role: '', 
        package: '', 
        offerDate: '',
        joiningDate: '',
        status: 'offered'
      }]
    }));
  };

  const handleRemovePlacement = (index) => {
    setFormData(prev => ({
      ...prev,
      placements: prev.placements.filter((_, i) => i !== index)
    }));
  };

  const handlePlacementChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      placements: prev.placements.map((placement, i) => 
        i === index ? { ...placement, [field]: value } : placement
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rollNumberValid) {
      alert('Please enter a valid roll number');
      return;
    }
    onSave(formData);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: FiUser },
    { id: 'academic', label: 'Academic Details', icon: FiBookOpen },
    { id: 'social', label: 'Social Profiles', icon: FiLinkedin },
    { id: 'skills', label: 'Skills', icon: FiCode },
    { id: 'certifications', label: 'Certifications', icon: FiAward },
    { id: 'internships', label: 'Internships', icon: FiBriefcase },
    { id: 'placements', label: 'Placements', icon: FiTrendingUp },
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
                  className="input pl-10 bg-gray-50 text-gray-700"
                  required
                  disabled
                  title="Email cannot be changed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email is linked to your roll number and cannot be changed
              </p>
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
                  placeholder="City, State"
                />
              </div>
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
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        )}

        {/* Academic Details Tab */}
        {activeTab === 'academic' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roll Number <span className="text-red-500">*</span>
              </label>
              <RollNumberInput
                value={formData.rollNumber}
                onChange={handleRollNumberChange}
                onValidationChange={setRollNumberValid}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                value={getDepartmentDisplay()}
                className="input bg-gray-50 text-gray-700"
                disabled
                title="Department is automatically determined from your roll number"
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-filled from roll number: {formData.department?.toUpperCase() || 'N/A'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Year
                </label>
                <select
                  value={formData.currentYear}
                  onChange={(e) => handleChange('currentYear', parseInt(e.target.value))}
                  className="input"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Semester
                </label>
                <select
                  value={formData.currentSemester}
                  onChange={(e) => handleChange('currentSemester', parseInt(e.target.value))}
                  className="input"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CGPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={(e) => handleChange('cgpa', e.target.value)}
                className="input"
                placeholder="9.5"
              />
            </div>

            <div>
              <FileUpload
                label="Resume/CV"
                accept=".pdf,.doc,.docx"
                maxSize={5}
                value={formData.resume}
                onChange={(file) => handleChange('resume', file)}
                showPreview={true}
                helperText="Upload your resume (Max 5MB, PDF/DOC/DOCX)"
              />
            </div>
          </div>
        )}

        {/* Social Profiles Tab */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Add your social media and professional profiles. LinkedIn is mandatory.
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
                Portfolio Website
              </label>
              <input
                type="url"
                value={formData.socialProfiles.portfolio}
                onChange={(e) => handleSocialProfileChange('portfolio', e.target.value)}
                className="input"
                placeholder="https://yourportfolio.com"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SiLeetcode className="inline w-4 h-4 mr-1" />
                LeetCode
              </label>
              <input
                type="url"
                value={formData.socialProfiles.leetcode}
                onChange={(e) => handleSocialProfileChange('leetcode', e.target.value)}
                className="input"
                placeholder="https://leetcode.com/yourusername"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SiCodechef className="inline w-4 h-4 mr-1" />
                CodeChef
              </label>
              <input
                type="url"
                value={formData.socialProfiles.codechef}
                onChange={(e) => handleSocialProfileChange('codechef', e.target.value)}
                className="input"
                placeholder="https://codechef.com/users/yourusername"
              />
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Add your technical and soft skills with proficiency levels
              </p>
              <button
                type="button"
                onClick={handleAddSkill}
                className="btn-primary flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add Skill
              </button>
            </div>

            {formData.skills.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No skills added yet. Click "Add Skill" to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                        className="input"
                        placeholder="Skill name (e.g., React, Python)"
                        required
                      />
                      <select
                        value={skill.proficiency}
                        onChange={(e) => handleSkillChange(index, 'proficiency', e.target.value)}
                        className="input"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Add your certifications and achievements
              </p>
              <button
                type="button"
                onClick={handleAddCertification}
                className="btn-primary flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add Certification
              </button>
            </div>

            {formData.certifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No certifications added yet. Click "Add Certification" to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Certification #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveCertification(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                        className="input"
                        placeholder="Certification name"
                        required
                      />
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                        className="input"
                        placeholder="Issuing organization"
                      />
                      <input
                        type="date"
                        value={cert.issueDate}
                        onChange={(e) => handleCertificationChange(index, 'issueDate', e.target.value)}
                        className="input"
                        placeholder="Issue date"
                      />
                      <input
                        type="date"
                        value={cert.expiryDate}
                        onChange={(e) => handleCertificationChange(index, 'expiryDate', e.target.value)}
                        className="input"
                        placeholder="Expiry date (optional)"
                      />
                      <input
                        type="text"
                        value={cert.credentialId}
                        onChange={(e) => handleCertificationChange(index, 'credentialId', e.target.value)}
                        className="input"
                        placeholder="Credential ID (optional)"
                      />
                      <input
                        type="text"
                        value={cert.score}
                        onChange={(e) => handleCertificationChange(index, 'score', e.target.value)}
                        className="input"
                        placeholder="Score/Grade (optional)"
                      />
                    </div>
                    <div className="mt-3">
                      <FileUpload
                        label="Certificate File"
                        accept=".pdf,.jpg,.jpeg,.png"
                        maxSize={5}
                        value={cert.file}
                        onChange={(file) => handleCertificationChange(index, 'file', file)}
                        showPreview={true}
                        helperText="Upload certificate (Max 5MB, PDF/JPG/PNG)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Internships Tab */}
        {activeTab === 'internships' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Add your internship experiences
              </p>
              <button
                type="button"
                onClick={handleAddInternship}
                className="btn-primary flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add Internship
              </button>
            </div>

            {formData.internships.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No internships added yet. Click "Add Internship" to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {formData.internships.map((internship, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Internship #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveInternship(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={internship.company}
                        onChange={(e) => handleInternshipChange(index, 'company', e.target.value)}
                        className="input"
                        placeholder="Company name"
                        required
                      />
                      <input
                        type="text"
                        value={internship.role}
                        onChange={(e) => handleInternshipChange(index, 'role', e.target.value)}
                        className="input"
                        placeholder="Role/Position"
                        required
                      />
                      <input
                        type="date"
                        value={internship.startDate}
                        onChange={(e) => handleInternshipChange(index, 'startDate', e.target.value)}
                        className="input"
                        placeholder="Start date"
                      />
                      <input
                        type="date"
                        value={internship.endDate}
                        onChange={(e) => handleInternshipChange(index, 'endDate', e.target.value)}
                        className="input"
                        placeholder="End date"
                      />
                    </div>
                    <textarea
                      value={internship.description}
                      onChange={(e) => handleInternshipChange(index, 'description', e.target.value)}
                      className="input"
                      rows={2}
                      placeholder="Description of responsibilities and achievements"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={internship.isPaid}
                        onChange={(e) => handleInternshipChange(index, 'isPaid', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Paid Internship</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Placements Tab */}
        {activeTab === 'placements' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Add your placement offers and job details
              </p>
              <button
                type="button"
                onClick={handleAddPlacement}
                className="btn-primary flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add Placement
              </button>
            </div>

            {formData.placements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No placements added yet. Click "Add Placement" to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {formData.placements.map((placement, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Placement #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemovePlacement(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={placement.company}
                        onChange={(e) => handlePlacementChange(index, 'company', e.target.value)}
                        className="input"
                        placeholder="Company name"
                        required
                      />
                      <input
                        type="text"
                        value={placement.role}
                        onChange={(e) => handlePlacementChange(index, 'role', e.target.value)}
                        className="input"
                        placeholder="Job role"
                        required
                      />
                      <input
                        type="text"
                        value={placement.package}
                        onChange={(e) => handlePlacementChange(index, 'package', e.target.value)}
                        className="input"
                        placeholder="Package (e.g., 12 LPA)"
                      />
                      <select
                        value={placement.status}
                        onChange={(e) => handlePlacementChange(index, 'status', e.target.value)}
                        className="input"
                      >
                        <option value="offered">Offered</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="joined">Joined</option>
                      </select>
                      <input
                        type="date"
                        value={placement.offerDate}
                        onChange={(e) => handlePlacementChange(index, 'offerDate', e.target.value)}
                        className="input"
                        placeholder="Offer date"
                      />
                      <input
                        type="date"
                        value={placement.joiningDate}
                        onChange={(e) => handlePlacementChange(index, 'joiningDate', e.target.value)}
                        className="input"
                        placeholder="Joining date"
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
          disabled={loading || !rollNumberValid}
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

export default ProfileEditForm;
