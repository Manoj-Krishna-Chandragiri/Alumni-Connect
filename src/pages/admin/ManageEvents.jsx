import { useState, useEffect } from 'react';
import adminApi from '../../api/admin.api';
import { EventForm, EventList } from '../../components/admin';
import { Modal, Loader, ErrorAlert, ConfirmModal } from '../../components/shared';
import { FiPlus } from 'react-icons/fi';

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
      setEvents(response.data);
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
          <p className="text-gray-500">
            Create and manage platform events
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-purple-600 text-sm font-medium">Total Events</p>
          <p className="text-2xl font-bold text-purple-800">{events.length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-600 text-sm font-medium">Upcoming</p>
          <p className="text-2xl font-bold text-blue-800">
            {events.filter((e) => new Date(e.date) > new Date()).length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm font-medium">Virtual</p>
          <p className="text-2xl font-bold text-green-800">
            {events.filter((e) => e.isVirtual).length}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-orange-600 text-sm font-medium">In-Person</p>
          <p className="text-2xl font-bold text-orange-800">
            {events.filter((e) => !e.isVirtual).length}
          </p>
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : (
        <EventList
          events={events}
          onEdit={(event) => setEditingEvent(event)}
          onDelete={(event) => setDeleteEvent(event)}
        />
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
