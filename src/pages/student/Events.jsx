import { useState, useEffect } from 'react';
import studentApi from '../../api/student.api';
import { EventCard } from '../../components/student';
import { SearchBar, Loader, ErrorAlert, EmptyState } from '../../components/shared';
import { FiCalendar, FiFilter } from 'react-icons/fi';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getEvents();
      setEvents(response.data);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    const eventDate = new Date(event.date);
    const now = new Date();

    if (filter === 'upcoming') return eventDate > now;
    if (filter === 'past') return eventDate < now;
    return true;
  });

  const upcomingCount = events.filter(
    (e) => new Date(e.date) > new Date()
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500">
            Discover and register for upcoming alumni events
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="badge-success">{upcomingCount} Upcoming</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search events..."
          />
        </div>
        <div className="flex gap-2">
          {['all', 'upcoming', 'past'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === filterOption
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          icon={FiCalendar}
          title="No events found"
          description={
            filter !== 'all'
              ? `No ${filter} events at the moment`
              : 'No events match your search'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
