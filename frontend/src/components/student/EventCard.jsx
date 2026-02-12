import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiExternalLink,
  FiMoreHorizontal,
} from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatRelativeTime } from '../../utils/timeUtils';

const EventCard = ({ event, onRegister }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'Date TBA';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return '';
    }
  };

  const isUpcoming = event.event_date ? new Date(event.event_date) > new Date() : false;
  const isPast = event.event_date ? new Date(event.event_date) < new Date() : false;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      {/* Event Image */}
      {event.event_image && (
        <div className="h-48 w-full">
          <img
            src={event.event_image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        {/* Event Type Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                event.event_type === 'webinar'
                  ? 'bg-blue-100 text-blue-800'
                  : event.event_type === 'workshop'
                  ? 'bg-purple-100 text-purple-800'
                  : event.event_type === 'conference'
                  ? 'bg-green-100 text-green-800'
                  : event.event_type === 'meetup'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {event.event_type || 'Event'}
            </span>
            {isPast && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">Past</span>
            )}
            {isUpcoming && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">Upcoming</span>
            )}
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <FiMoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{event.title}</h3>

        {/* Description */}
        <div className="text-gray-600 text-sm line-clamp-3 mb-4 prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {event.description}
          </ReactMarkdown>
        </div>

        {/* Event Details */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FiCalendar className="w-4 h-4 flex-shrink-0" />
            <span>{formatDate(event.event_date)}</span>
          </div>
          {event.event_date && (
            <div className="flex items-center gap-2 text-gray-600">
              <FiClock className="w-4 h-4 flex-shrink-0" />
              <span>{formatTime(event.event_date)}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <FiMapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
          {event.registrations_count > 0 && (
            <div className="flex items-center gap-2 text-gray-600">
              <FiUsers className="w-4 h-4 flex-shrink-0" />
              <span>{event.registrations_count} registered</span>
            </div>
          )}
        </div>

        {/* Register Button */}
        {isUpcoming && event.registration_link && (
          <a
            href={event.registration_link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onRegister && onRegister(event)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register Now
            <FiExternalLink className="w-4 h-4" />
          </a>
        )}

        {isUpcoming && !event.registration_link && (
          <button
            className="w-full px-4 py-2.5 bg-gray-100 text-gray-500 text-sm font-semibold rounded-lg cursor-not-allowed"
            disabled
          >
            Registration Link Coming Soon
          </button>
        )}

        {isPast && (
          <button
            disabled
            className="w-full px-4 py-2.5 bg-gray-100 text-gray-500 text-sm font-semibold rounded-lg cursor-not-allowed"
          >
            Event Ended
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
