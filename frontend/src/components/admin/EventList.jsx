import { FiEdit2, FiTrash2, FiUsers, FiCalendar, FiMapPin, FiVideo } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const EventList = ({ events, onEdit, onDelete, onViewRegistrations }) => {
  const getEventTypeColor = (type) => {
    const colors = {
      workshop: 'bg-blue-100 text-blue-700',
      seminar: 'bg-purple-100 text-purple-700',
      webinar: 'bg-green-100 text-green-700',
      meetup: 'bg-orange-100 text-orange-700',
      fair: 'bg-red-100 text-red-700',
      conference: 'bg-indigo-100 text-indigo-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            {/* Event Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getEventTypeColor(event.type)}`}>
                  {event.type}
                </span>
                {event.isVirtual && (
                  <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-teal-100 text-teal-700 rounded-full">
                    <FiVideo className="w-3 h-3" />
                    Virtual
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {event.title}
              </h3>
              <div className="text-gray-600 text-sm mb-3 line-clamp-4 prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {event.description}
                </ReactMarkdown>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  {formatDate(event.date)} at {event.time}
                </span>
                {event.isVirtual ? (
                  <span className="flex items-center gap-1 text-primary-600">
                    <FiVideo className="w-4 h-4" />
                    Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <FiMapPin className="w-4 h-4" />
                    {event.location}
                  </span>
                )}
                {event.capacity && (
                  <span className="flex items-center gap-1">
                    <FiUsers className="w-4 h-4" />
                    {event.registrations || 0}/{event.capacity} registered
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {onViewRegistrations && (
                <button
                  onClick={() => onViewRegistrations(event)}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                  title="View Registrations"
                >
                  <FiUsers className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => onEdit(event)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Edit Event"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(event)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete Event"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {events.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No events found</p>
        </div>
      )}
    </div>
  );
};

export default EventList;
