import { useState, useEffect } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { Loader } from '../shared';
import adminApi from '../../api/admin.api';

const EventForm = ({ event, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    type: 'workshop',
    event_image: '',
    registration_link: '',
    max_participants: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        event_date: event.event_date ? event.event_date.split('.')[0] : '',
        location: event.location || '',
        type: event.event_type || event.type || 'workshop',
        event_image: event.event_image || event.image || '',
        registration_link: event.registration_link || event.registrationLink || '',
        max_participants: event.max_participants || '',
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
      formDataUpload.append('folder', 'alumni-connect/events');
      
      const response = await adminApi.uploadImage(formDataUpload);
      
      if (response.data?.url) {
        setFormData((prev) => ({ ...prev, event_image: response.data.url }));
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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Career Fair 2024"
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Describe the event..."
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Cover Image
        </label>
        <div className="space-y-2">
          {/* Image URL Input */}
          <input
            type="url"
            name="event_image"
            value={formData.event_image}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/event-image.jpg"
          />
          <div className="text-xs text-gray-500 text-center">OR</div>
          {/* File Upload */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="eventImageUpload"
              disabled={uploading}
            />
            <label
              htmlFor="eventImageUpload"
              className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
            >
              <FiUpload className="w-4 h-4" />
              <span className="text-sm">
                {uploading ? 'Uploading...' : 'Upload Event Image'}
              </span>
            </label>
          </div>
          {/* Preview */}
          {formData.event_image && (
            <div className="relative">
              <img
                src={formData.event_image}
                alt="Event preview"
                className="w-full h-40 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, event_image: '' }))}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Date & Time *
          </label>
          <input
            type="datetime-local"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Type *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="webinar">Webinar</option>
            <option value="meetup">Meetup</option>
            <option value="conference">Conference</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Participants
          </label>
          <input
            type="number"
            name="max_participants"
            value={formData.max_participants}
            onChange={handleChange}
            placeholder="Optional"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location *
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Main Auditorium or Online (Zoom)"
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Registration Link
        </label>
        <input
          type="url"
          name="registration_link"
          value={formData.registration_link}
          onChange={handleChange}
          placeholder="https://forms.google.com/..."
          className="input-field"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader size="sm" />
              Saving...
            </div>
          ) : event ? (
            'Update Event'
          ) : (
            'Create Event'
          )}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
