import { useState, useEffect } from 'react';
import { FiUpload, FiX, FiCalendar, FiMapPin, FiLink, FiUsers, FiType, FiAlignLeft } from 'react-icons/fi';
import { Loader } from '../shared';
import adminApi from '../../api/admin.api';

const INPUT_CLS = 'w-full px-4 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition-all placeholder-gray-400';
const LABEL_CLS = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5';

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
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
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
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const eventTypes = [
    { value: 'workshop',    label: 'Workshop' },
    { value: 'seminar',     label: 'Seminar' },
    { value: 'webinar',     label: 'Webinar' },
    { value: 'meetup',      label: 'Meetup' },
    { value: 'conference',  label: 'Conference' },
    { value: 'other',       label: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className={LABEL_CLS}>
          <FiType className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
          Event Title <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Annual Tech Fest 2026"
          className={INPUT_CLS}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className={LABEL_CLS}>
          <FiAlignLeft className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
          Description <span className="text-rose-400">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe the event, agenda, and what attendees can expect..."
          className={INPUT_CLS}
          required
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className={LABEL_CLS}>Event Cover Image</label>
        <div className="space-y-2">
          <input
            type="url"
            name="event_image"
            value={formData.event_image}
            onChange={handleChange}
            className={INPUT_CLS}
            placeholder="https://example.com/event-image.jpg"
          />
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
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
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer transition-all text-gray-500 hover:text-indigo-600"
            >
              <FiUpload className="w-4 h-4" />
              <span className="text-sm font-medium">
                {uploading ? 'Uploading...' : 'Upload Event Cover Image'}
              </span>
            </label>
          </div>
          {formData.event_image && (
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={formData.event_image}
                alt="Event cover preview"
                className="w-full h-44 object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, event_image: '' }))}
                className="absolute top-2 right-2 p-1.5 bg-gray-900/70 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Date, Type, Location, Max Participants grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>
            <FiCalendar className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
            Date &amp; Time <span className="text-rose-400">*</span>
          </label>
          <input
            type="datetime-local"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            className={INPUT_CLS}
            required
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Event Type <span className="text-rose-400">*</span></label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={INPUT_CLS}
            required
          >
            {eventTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL_CLS}>
            <FiMapPin className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
            Location <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Main Auditorium or Zoom"
            className={INPUT_CLS}
            required
          />
        </div>
        <div>
          <label className={LABEL_CLS}>
            <FiUsers className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
            Max Participants
          </label>
          <input
            type="number"
            name="max_participants"
            value={formData.max_participants}
            onChange={handleChange}
            placeholder="Optional"
            min="1"
            className={INPUT_CLS}
          />
        </div>
      </div>

      {/* Registration Link */}
      <div>
        <label className={LABEL_CLS}>
          <FiLink className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
          Registration Link
        </label>
        <input
          type="url"
          name="registration_link"
          value={formData.registration_link}
          onChange={handleChange}
          placeholder="https://forms.google.com/..."
          className={INPUT_CLS}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#A8422F] via-[#C4503A] to-[#E77E69] rounded-xl hover:opacity-90 shadow-sm transition-all disabled:opacity-60 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader size="sm" />
              Saving...
            </>
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
