import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiExternalLink,
} from 'react-icons/fi';

const EventCard = ({ event, onRegister }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isUpcoming = new Date(event.date) > new Date();
  const isPast = new Date(event.date) < new Date();

  return (
    <div className="card-hover">
      {/* Event Image */}
      {event.image && (
        <div className="h-40 -mx-6 -mt-6 mb-4">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover rounded-t-xl"
          />
        </div>
      )}

      {/* Event Type Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`badge ${
            event.type === 'Online'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {event.type}
        </span>
        {isPast && (
          <span className="badge bg-gray-100 text-gray-600">Past Event</span>
        )}
        {isUpcoming && event.featured && (
          <span className="badge bg-yellow-100 text-yellow-800">Featured</span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-lg text-gray-900 mb-2">{event.title}</h3>

      {/* Description */}
      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
        {event.description}
      </p>

      {/* Event Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiCalendar className="w-4 h-4" />
          <span>{formatDate(event.date)}</span>
        </div>
        {event.time && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiClock className="w-4 h-4" />
            <span>{formatTime(event.time)}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiMapPin className="w-4 h-4" />
          <span>{event.location || event.platform}</span>
        </div>
        {event.attendees && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiUsers className="w-4 h-4" />
            <span>{event.attendees} registered</span>
          </div>
        )}
      </div>

      {/* Register Button */}
      {isUpcoming && (
        <a
          href={event.registrationLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onRegister && onRegister(event)}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          Register Now
          <FiExternalLink className="w-4 h-4" />
        </a>
      )}

      {isPast && (
        <button
          disabled
          className="w-full btn bg-gray-100 text-gray-500 cursor-not-allowed"
        >
          Event Ended
        </button>
      )}
    </div>
  );
};

export default EventCard;
