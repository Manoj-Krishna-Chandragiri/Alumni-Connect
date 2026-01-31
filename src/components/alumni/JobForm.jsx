import { useState } from 'react';
import { FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiX } from 'react-icons/fi';
import { Loader } from '../../components/shared';

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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
