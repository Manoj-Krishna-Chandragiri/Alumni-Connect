import { useState, useEffect } from 'react';
import adminApi from '../../api/admin.api';
import { EventForm, EventList } from '../../components/admin';
import { Modal, Loader, ErrorAlert, ConfirmModal } from '../../components/shared';
import { FiPlus, FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteEvent, setDeleteEvent] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getEvents();
      // Handle paginated response (results array) or direct array
      const eventsData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.results || [];
      setEvents(eventsData);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      setProcessing(true);
      await adminApi.createEvent(eventData);
      setShowForm(false);
      fetchEvents();
    } catch (err) {
      setError('Failed to create event');
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      setProcessing(true);
      await adminApi.updateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      setError('Failed to update event');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      setProcessing(true);
      await adminApi.deleteEvent(deleteEvent.id);
      setDeleteEvent(null);
      fetchEvents();
    } catch (err) {
      setError('Failed to delete event');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#A8422F] via-[#C4503A] to-[#E77E69] rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Manage Events</h1>
          <p className="text-rose-100 mt-1 text-sm">Create and manage alumni connect platform events</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-semibold rounded-xl transition-all backdrop-blur-sm shadow-sm"
        >
          <FiPlus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[{
          icon: FiCalendar, label: 'Total Events',
          value: events.length,
          color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200'
        }, {
          icon: FiClock, label: 'Upcoming',
          value: events.filter((e) => new Date(e.event_date || e.date) > new Date()).length,
          color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200'
        }, {
          icon: FiMapPin, label: 'Webinar / Online',
          value: events.filter((e) => (e.type || e.event_type) === 'webinar' || e.isVirtual).length,
          color: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200'
        }, {
          icon: FiUsers, label: 'In-Person',
          value: events.filter((e) => (e.type || e.event_type) !== 'webinar' && !e.isVirtual).length,
          color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200'
        }].map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className={`rounded-xl border ${border} ${bg} p-5 flex items-center gap-4 shadow-sm`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/60 shadow-sm flex-shrink-0 ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide opacity-80 ${color}`}>{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Events List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">All Events</h2>
            <span className="text-xs text-gray-400">{events.length} event{events.length !== 1 ? 's' : ''}</span>
          </div>
          <EventList
            events={events}
            onEdit={(event) => setEditingEvent(event)}
            onDelete={(event) => setDeleteEvent(event)}
          />
        </div>
      )}

      {/* Create Event Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Create Event"
        size="lg"
      >
        <EventForm
          onSubmit={handleCreateEvent}
          onCancel={() => setShowForm(false)}
          loading={processing}
        />
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        title="Edit Event"
        size="lg"
      >
        <EventForm
          event={editingEvent}
          onSubmit={handleUpdateEvent}
          onCancel={() => setEditingEvent(null)}
          loading={processing}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteEvent}
        onClose={() => setDeleteEvent(null)}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteEvent?.title}"? This action cannot be undone.`}
        confirmText={processing ? 'Deleting...' : 'Delete'}
        variant="danger"
      />
    </div>
  );
};

export default ManageEvents;
