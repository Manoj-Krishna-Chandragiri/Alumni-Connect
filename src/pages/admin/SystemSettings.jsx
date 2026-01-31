import { useState, useEffect } from 'react';
import adminApi from '../../api/admin.api';
import { Loader, ErrorAlert } from '../../components/shared';
import { FiSave, FiSettings, FiShield, FiMail, FiUpload, FiAlertTriangle } from 'react-icons/fi';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    allowRegistration: true,
    requireEmailVerification: true,
    alumniVerificationRequired: true,
    maxUploadSize: 10,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getSettings();
      setSettings(response.data);
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      await adminApi.updateSettings(settings);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500">Configure platform-wide settings</p>
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

      {/* Error/Success Alerts */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          {success}
        </div>
      )}

      {/* Settings Sections */}
      <div className="grid gap-6">
        {/* Registration Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiSettings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Registration Settings</h2>
              <p className="text-sm text-gray-500">Control user registration options</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">Allow New Registrations</p>
                <p className="text-sm text-gray-500">Enable users to register on the platform</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => handleChange('allowRegistration', e.target.checked)}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">Require Email Verification</p>
                <p className="text-sm text-gray-500">Users must verify email before access</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => handleChange('requireEmailVerification', e.target.checked)}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiShield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
              <p className="text-sm text-gray-500">Manage security and verification</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">Alumni Verification Required</p>
                <p className="text-sm text-gray-500">Alumni must be verified by admin to access full features</p>
              </div>
              <input
                type="checkbox"
                checked={settings.alumniVerificationRequired}
                onChange={(e) => handleChange('alumniVerificationRequired', e.target.checked)}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
            </label>
          </div>
        </div>

        {/* Upload Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiUpload className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Upload Settings</h2>
              <p className="text-sm text-gray-500">Configure file upload limits</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block">
                <p className="font-medium text-gray-900 mb-2">Maximum Upload Size (MB)</p>
                <input
                  type="number"
                  value={settings.maxUploadSize}
                  onChange={(e) => handleChange('maxUploadSize', parseInt(e.target.value))}
                  min="1"
                  max="100"
                  className="input w-32"
                />
                <p className="text-sm text-gray-500 mt-1">Maximum file size for uploads (1-100 MB)</p>
              </label>
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Maintenance Mode</h2>
              <p className="text-sm text-gray-500">Take the site offline for maintenance</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-red-50 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">Enable Maintenance Mode</p>
                <p className="text-sm text-gray-500">Only admins can access the site when enabled</p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
