import { useState, useEffect } from 'react';
import { Loader } from '../shared';

const EventForm = ({ event, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'workshop',
    capacity: '',
    registrationDeadline: '',
    isVirtual: false,
    meetingLink: '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        type: event.type || 'workshop',
        capacity: event.capacity || '',
        registrationDeadline: event.registrationDeadline || '',
        isVirtual: event.isVirtual || false,
        meetingLink: event.meetingLink || '',
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time *
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            <option value="fair">Career Fair</option>
            <option value="conference">Conference</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Max attendees"
            className="input-field"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isVirtual"
          id="isVirtual"
          checked={formData.isVirtual}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="isVirtual" className="text-sm text-gray-700">
          Virtual Event
        </label>
      </div>

      {formData.isVirtual ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meeting Link
          </label>
          <input
            type="url"
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleChange}
            placeholder="https://meet.google.com/..."
            className="input-field"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Main Auditorium"
            className="input-field"
            required={!formData.isVirtual}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Registration Deadline
        </label>
        <input
          type="date"
          name="registrationDeadline"
          value={formData.registrationDeadline}
          onChange={handleChange}
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
