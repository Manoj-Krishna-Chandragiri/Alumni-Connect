import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiBell, FiLock, FiMoon, FiGlobe, FiSave } from 'react-icons/fi';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const [settings, setSettings] = useState({
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    jobAlerts: true,
    blogUpdates: false,

    // Privacy settings
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,

    // Appearance
    theme: 'light',
    language: 'en',
  });

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSuccess('Settings saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: FiUser },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'privacy', label: 'Privacy', icon: FiLock },
    { id: 'appearance', label: 'Appearance', icon: FiMoon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your account preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          <FiSave className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {activeTab === 'account' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Contact support to change your email</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || ''}
                  disabled
                  className="input bg-gray-50 capitalize"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h3>
              <button className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
                Delete Account
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                { key: 'eventReminders', label: 'Event Reminders', desc: 'Get reminded about upcoming events' },
                { key: 'jobAlerts', label: 'Job Alerts', desc: 'Notifications for new job postings' },
                { key: 'blogUpdates', label: 'Blog Updates', desc: 'When new blogs are published' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={(e) => handleChange(item.key, e.target.checked)}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Privacy Settings</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block">
                  <p className="font-medium text-gray-900 mb-2">Profile Visibility</p>
                  <select
                    value={settings.profileVisibility}
                    onChange={(e) => handleChange('profileVisibility', e.target.value)}
                    className="input"
                  >
                    <option value="public">Public - Anyone can view</option>
                    <option value="alumni">Alumni Only - Only verified alumni</option>
                    <option value="private">Private - Only you</option>
                  </select>
                </label>
              </div>
              {[
                { key: 'showEmail', label: 'Show Email Address', desc: 'Display your email on your profile' },
                { key: 'showPhone', label: 'Show Phone Number', desc: 'Display your phone on your profile' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={(e) => handleChange(item.key, e.target.checked)}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block">
                  <p className="font-medium text-gray-900 mb-2">Theme</p>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleChange('theme', e.target.value)}
                    className="input"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </label>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block">
                  <p className="font-medium text-gray-900 mb-2">Language</p>
                  <select
                    value={settings.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="input"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
