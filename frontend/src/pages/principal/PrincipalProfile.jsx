import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import { Loader, ErrorAlert } from '../../components/shared';
import {
  FiEdit2, FiMail, FiPhone, FiBriefcase, FiUser, FiSave, FiX, FiShield,
} from 'react-icons/fi';

const PrincipalProfile = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

  const handleEdit = () => {
    setForm({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });
    setEditMode(true);
    setError('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const response = await axiosInstance.patch('/auth/me/', form);
      updateUser(response.data);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#A8422F] via-[#C4503A] to-[#E77E69] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">My Profile</h1>
        <p className="text-rose-100 text-sm">Manage your account information</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 font-medium">
          {success}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#A8422F] to-[#E77E69] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-md">
            {initials || <FiUser className="w-10 h-10" />}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{fullName || '—'}</h2>
            <span className="inline-block mt-1 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
              Principal
            </span>
            <p className="text-gray-500 mt-2 text-sm">VVIT Institution</p>
          </div>
          {!editMode && (
            <button onClick={handleEdit} className="btn-primary flex items-center gap-2 flex-shrink-0">
              <FiEdit2 className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {editMode && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader size="sm" /> : <FiSave className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => { setEditMode(false); setError(''); }} className="btn-secondary flex items-center gap-2">
              <FiX className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Contact & Role Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-lg"><FiMail className="w-5 h-5 text-rose-600" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Email</p>
                <p className="text-gray-900 font-medium">{user?.email || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-lg"><FiPhone className="w-5 h-5 text-rose-600" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Phone</p>
                <p className="text-gray-900 font-medium">{user?.phone || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-lg"><FiBriefcase className="w-5 h-5 text-rose-600" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Role</p>
                <p className="text-gray-900 font-medium">Principal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-lg"><FiShield className="w-5 h-5 text-rose-600" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Account Status</p>
                <span className="inline-flex items-center gap-1 text-green-700 font-medium text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Active & Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalProfile;
