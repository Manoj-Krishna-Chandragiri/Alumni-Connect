import { useState, useEffect } from 'react';
import { FiX, FiUser, FiMail, FiShield, FiBriefcase } from 'react-icons/fi';
import { DEPARTMENTS_LIST } from '../../utils/rollNumberUtils';

const ROLE_HEADER = {
  student:    { gradient: 'from-blue-500 to-blue-700',     label: 'Student' },
  alumni:     { gradient: 'from-emerald-500 to-emerald-700', label: 'Alumni' },
  counsellor: { gradient: 'from-purple-500 to-purple-700',  label: 'Counsellor' },
  hod:        { gradient: 'from-orange-500 to-orange-700',  label: 'HOD' },
  principal:  { gradient: 'from-rose-500 to-rose-700',      label: 'Principal' },
  admin:      { gradient: 'from-indigo-600 to-indigo-800',  label: 'Admin' },
};



const InputGroup = ({ icon: Icon, label, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
      {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
      {label}
    </label>
    {children}
  </div>
);

const fieldCls = 'w-full px-3.5 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 focus:bg-white transition-all placeholder-gray-400';

const UserEditModal = ({ user, isOpen, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'student',
    department: '',
    active: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || user.firstName || user.name?.split(' ')[0] || '',
        lastName:  user.last_name  || user.lastName  || user.name?.split(' ').slice(1).join(' ') || '',
        email:     user.email || '',
        role:      user.role || 'student',
        department: user.department || '',
        active:    user.active !== false,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...user, ...formData });
  };

  if (!isOpen) return null;

  const displayName = `${formData.firstName} ${formData.lastName}`.trim() || 'User';
  const initials = displayName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const roleConfig = ROLE_HEADER[formData.role] || ROLE_HEADER.student;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">

        {/* Coloured Header */}
        <div className={`bg-gradient-to-r ${roleConfig.gradient} px-6 pt-6 pb-10`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-0.5">
                Edit Account
              </p>
              <h2 className="text-xl font-bold text-white">
                {displayName}
              </h2>
              <p className="text-white/70 text-sm mt-0.5">{formData.email}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Avatar float */}
        <div className="relative -mt-8 px-6 mb-2 flex items-end gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-white flex-shrink-0`}>
            {user?.avatar
              ? <img src={user.avatar} alt={displayName} className="w-full h-full object-cover rounded-2xl" />
              : initials
            }
          </div>
          <div className="pb-1">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${roleConfig.gradient} text-white shadow-sm`}>
              {roleConfig.label}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InputGroup icon={FiUser} label="First Name">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={fieldCls}
                required
                placeholder="First name"
              />
            </InputGroup>
            <InputGroup label="Last Name">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={fieldCls}
                required
                placeholder="Last name"
              />
            </InputGroup>
          </div>

          <InputGroup icon={FiMail} label="Email Address">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${fieldCls} text-gray-500 cursor-not-allowed`}
              readOnly
            />
          </InputGroup>

          <InputGroup icon={FiShield} label="Role">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={fieldCls}
            >
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
              <option value="counsellor">Counsellor</option>
              <option value="hod">HOD</option>
              <option value="principal">Principal</option>
              <option value="admin">Admin</option>
            </select>
          </InputGroup>

          <InputGroup icon={FiBriefcase} label="Department">
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={fieldCls}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS_LIST.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </InputGroup>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <p className="text-sm font-semibold text-gray-700">Account Status</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formData.active ? 'User can log in and access the platform' : 'User is blocked from the platform'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, active: !prev.active }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 ${
                formData.active ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  formData.active ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm bg-gradient-to-r ${roleConfig.gradient} hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
