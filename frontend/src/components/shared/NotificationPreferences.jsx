import { useState, useEffect } from 'react';
import { 
  FiMail, FiBell, FiBriefcase, FiCalendar, FiMessageCircle, 
  FiUserPlus, FiAlertCircle, FiSave
} from 'react-icons/fi';
import { 
  getNotificationPreferences, 
  updateNotificationPreferences 
} from '../../api/notifications.api';
import { Loader } from '../shared';

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    // Email notifications
    email_job_notifications: true,
    email_event_notifications: true,
    email_comment_notifications: true,
    email_connection_requests: true,
    email_announcements: true,
    email_weekly_digest: true,
    
    // In-app notifications
    inapp_job_notifications: true,
    inapp_event_notifications: true,
    inapp_comment_notifications: true,
    inapp_connection_requests: true,
    inapp_announcements: true,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const data = await getNotificationPreferences();
      setPreferences(data);
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (field) => {
    setPreferences(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      await updateNotificationPreferences(preferences);
      setSaveMessage('Preferences saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setSaveMessage('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
          <p className="text-gray-600 mt-1">
            Choose how you want to receive notifications
          </p>
        </div>

        {/* Email Notifications */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FiMail className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
          </div>
          <div className="space-y-2">
            <ToggleSwitch
              enabled={preferences.email_job_notifications}
              onChange={() => handleToggle('email_job_notifications')}
              label="Job Opportunities"
              description="Receive emails about job postings that match your profile"
            />
            <ToggleSwitch
              enabled={preferences.email_event_notifications}
              onChange={() => handleToggle('email_event_notifications')}
              label="Events"
              description="Get notified about upcoming events and reminders"
            />
            <ToggleSwitch
              enabled={preferences.email_comment_notifications}
              onChange={() => handleToggle('email_comment_notifications')}
              label="Comments & Replies"
              description="Receive emails when someone comments on your posts"
            />
            <ToggleSwitch
              enabled={preferences.email_connection_requests}
              onChange={() => handleToggle('email_connection_requests')}
              label="Connection Requests"
              description="Get notified when someone wants to connect with you"
            />
            <ToggleSwitch
              enabled={preferences.email_announcements}
              onChange={() => handleToggle('email_announcements')}
              label="Announcements"
              description="Receive important announcements from VVITU"
            />
            <ToggleSwitch
              enabled={preferences.email_weekly_digest}
              onChange={() => handleToggle('email_weekly_digest')}
              label="Weekly Digest"
              description="Get a weekly summary of activities and updates"
            />
          </div>
        </div>

        {/* In-App Notifications */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiBell className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">In-App Notifications</h3>
          </div>
          <div className="space-y-2">
            <ToggleSwitch
              enabled={preferences.inapp_job_notifications}
              onChange={() => handleToggle('inapp_job_notifications')}
              label="Job Opportunities"
              description="Show notifications for new job postings"
            />
            <ToggleSwitch
              enabled={preferences.inapp_event_notifications}
              onChange={() => handleToggle('inapp_event_notifications')}
              label="Events"
              description="Show notifications for events and reminders"
            />
            <ToggleSwitch
              enabled={preferences.inapp_comment_notifications}
              onChange={() => handleToggle('inapp_comment_notifications')}
              label="Comments & Replies"
              description="Show notifications for comments on your posts"
            />
            <ToggleSwitch
              enabled={preferences.inapp_connection_requests}
              onChange={() => handleToggle('inapp_connection_requests')}
              label="Connection Requests"
              description="Show notifications for new connection requests"
            />
            <ToggleSwitch
              enabled={preferences.inapp_announcements}
              onChange={() => handleToggle('inapp_announcements')}
              label="Announcements"
              description="Show notifications for important announcements"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="p-6 bg-gray-50 flex items-center justify-between rounded-b-lg">
          <div className="text-sm">
            {saveMessage && (
              <p className={`font-medium ${
                saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'
              }`}>
                {saveMessage}
              </p>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
