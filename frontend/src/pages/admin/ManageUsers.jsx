import { useState, useEffect } from 'react';
import adminApi from '../../api/admin.api';
import { UserTable, UserEditModal } from '../../components/admin';
import { Loader, ErrorAlert, ConfirmModal, Pagination } from '../../components/shared';
import { FiPlus, FiDownload } from 'react-icons/fi';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [toggleUser, setToggleUser] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 15;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsers();
      // Handle paginated response (results array) or direct array
      const usersData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.results || [];
      setUsers(usersData);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      setProcessing(true);
      await adminApi.updateUser(userData.id, userData);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setProcessing(true);
      await adminApi.deleteUser(deleteUser.id);
      setDeleteUser(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setProcessing(true);
      await adminApi.toggleUserStatus(toggleUser.id);
      setToggleUser(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user status');
    } finally {
      setProcessing(false);
    }
  };

  const handleExport = () => {
    alert('Exporting user data...');
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-500">
            View and manage all platform users
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2"
          >
            <FiDownload className="w-4 h-4" />
            Export
          </button>
          <button className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-600 text-sm font-medium">Total Users</p>
          <p className="text-2xl font-bold text-blue-800">{users.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm font-medium">Active</p>
          <p className="text-2xl font-bold text-green-800">
            {users.filter((u) => u.active !== false).length}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm font-medium">Disabled</p>
          <p className="text-2xl font-bold text-red-800">
            {users.filter((u) => u.active === false).length}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-purple-600 text-sm font-medium">Admins</p>
          <p className="text-2xl font-bold text-purple-800">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : (
        <UserTable
          users={paginatedUsers}
          onEdit={(user) => setEditingUser(user)}
          onDelete={(user) => setDeleteUser(user)}
          onToggleStatus={(user) => setToggleUser(user)}
        />
      )}

      {/* Pagination */}
      {!loading && users.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(users.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Edit User Modal */}
      <UserEditModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleUpdateUser}
        loading={processing}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteUser?.name}? This action cannot be undone.`}
        confirmText={processing ? 'Deleting...' : 'Delete'}
        variant="danger"
      />

      {/* Toggle Status Confirmation */}
      <ConfirmModal
        isOpen={!!toggleUser}
        onClose={() => setToggleUser(null)}
        onConfirm={handleToggleStatus}
        title={toggleUser?.active ? 'Disable User' : 'Enable User'}
        message={`Are you sure you want to ${toggleUser?.active ? 'disable' : 'enable'} ${toggleUser?.name}'s account?`}
        confirmText={processing ? 'Processing...' : toggleUser?.active ? 'Disable' : 'Enable'}
        variant={toggleUser?.active ? 'danger' : 'primary'}
      />
    </div>
  );
};

export default ManageUsers;
