import { useState } from 'react';
import { FiBriefcase, FiMapPin, FiClock, FiX, FiUpload } from 'react-icons/fi';
import { Loader } from '../../components/shared';
import alumniApi from '../../api/alumni.api';

const JobForm = ({ job, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    company: job?.company || '',
    location: job?.location || '',
    type: job?.type || 'Full-time',
    salary: job?.salary || '',
    experience: job?.experience || '',
    description: job?.description || '',
    requirements: job?.requirements || '',
    skills: job?.skills?.join(', ') || '',
    applicationLink: job?.applicationLink || '',
    coverImage: job?.coverImage || '',
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'alumni-connect/jobs');
      
      const response = await alumniApi.uploadImage(formDataUpload);
      
      if (response.data?.url) {
        setFormData((prev) => ({ ...prev, coverImage: response.data.url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
    });
  };

  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Cover Image (Optional)
        </label>
        <div className="space-y-2">
          {/* Image URL Input */}
          <input
            type="url"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="input"
            placeholder="https://example.com/job-cover.jpg"
          />
          <div className="text-xs text-gray-500 text-center">OR</div>
          {/* File Upload */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="jobCoverUpload"
              disabled={uploading}
            />
            <label
              htmlFor="jobCoverUpload"
              className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
            >
              <FiUpload className="w-4 h-4" />
              <span className="text-sm">
                {uploading ? 'Uploading...' : 'Upload Cover Image'}
              </span>
            </label>
          </div>
          {/* Preview */}
          {formData.coverImage && (
            <div className="relative">
              <img
                src={formData.coverImage}
                alt="Job cover preview"
                className="w-full h-40 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, coverImage: '' }))}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Software Engineer"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company *
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Google"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Bangalore, India"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="input"
            required
          >
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Range
          </label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="input"
            placeholder="e.g., ₹8-12 LPA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Required
          </label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="input"
            placeholder="e.g., 0-2 years"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="input"
          placeholder="Describe the role and responsibilities..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Requirements
        </label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          rows={3}
          className="input"
          placeholder="List the requirements for this position..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Required Skills
        </label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="input"
          placeholder="e.g., React, Node.js, Python (comma separated)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Application Link *
        </label>
        <input
          type="url"
          name="applicationLink"
          value={formData.applicationLink}
          onChange={handleChange}
          className="input"
          placeholder="https://forms.google.com/..."
          required
        />
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader size="sm" color="white" /> : job ? 'Update Job' : 'Post Job'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
