import axiosInstance from './axiosInstance';
import { mockAdminData } from '../mock/admin.mock';

// Use real backend data
const USE_MOCK = false;

const adminApi = {
  // Users Management (all users)
  getUsers: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAdminData.users || [] };
    }
    return axiosInstance.get('/admin/users/', { params: { page_size: 500, ...filters } });
  },

  updateUser: async (id, data) => {
    if (USE_MOCK) {
      return { data: { success: true, id, ...data } };
    }
    return axiosInstance.put(`/admin/users/${id}/`, data);
  },

  deleteUser: async (id) => {
    if (USE_MOCK) {
      return { data: { success: true, id } };
    }
    return axiosInstance.delete(`/admin/users/${id}/`);
  },

  toggleUserStatus: async (id) => {
    if (USE_MOCK) {
      return { data: { success: true, id } };
    }
    return axiosInstance.post(`/admin/users/${id}/toggle-status/`);
  },

  // Alumni Verification
  getPendingAlumni: async () => {
    if (USE_MOCK) {
      return { data: mockAdminData.pendingAlumni || [] };
    }
    return axiosInstance.get('/admin/alumni/pending/');
  },

  verifyAlumni: async (id, status = 'verified', remarks = '') => {
    if (USE_MOCK) {
      return { data: { success: true, id, status } };
    }
    return axiosInstance.post(`/admin/alumni/${id}/verify/`, { status, remarks });
  },

  rejectAlumni: async (id, remarks = '') => {
    if (USE_MOCK) {
      return { data: { success: true, id, status: 'rejected' } };
    }
    return axiosInstance.post(`/admin/alumni/${id}/reject/`, { remarks });
  },

  // Student Management
  getStudents: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAdminData.students || [] };
    }
    return axiosInstance.get('/students/', { params: filters });
  },

  updateStudent: async (id, data) => {
    if (USE_MOCK) {
      return { data: { success: true, ...data } };
    }
    return axiosInstance.patch(`/students/${id}/`, data);
  },

  deactivateStudent: async (id) => {
    if (USE_MOCK) {
      return { data: { success: true, id } };
    }
    return axiosInstance.post(`/admin/students/${id}/toggle-status/`);
  },

  // Alumni Management
  getAlumni: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAdminData.alumni || [] };
    }
    return axiosInstance.get('/alumni/', { params: filters });
  },

  updateAlumni: async (id, data) => {
    if (USE_MOCK) {
      return { data: { success: true, ...data } };
    }
    return axiosInstance.patch(`/alumni/${id}/`, data);
  },

  deactivateAlumni: async (userId) => {
    if (USE_MOCK) {
      return { data: { success: true, userId } };
    }
    return axiosInstance.post(`/admin/users/${userId}/toggle-status/`);
  },

  // Events Management
  getEvents: async () => {
    if (USE_MOCK) {
      return { data: mockAdminData.events || [] };
    }
    return axiosInstance.get('/events/');
  },

  createEvent: async (eventData) => {
    if (USE_MOCK) {
      const newEvent = { id: Date.now().toString(), ...eventData, createdAt: new Date().toISOString() };
      return { data: newEvent };
    }
    return axiosInstance.post('/events/', eventData);
  },

  updateEvent: async (id, eventData) => {
    if (USE_MOCK) {
      return { data: { success: true, ...eventData } };
    }
    return axiosInstance.put(`/events/${id}/`, eventData);
  },

  deleteEvent: async (id) => {
    if (USE_MOCK) {
      return { data: { success: true, id } };
    }
    return axiosInstance.delete(`/events/${id}/`);
  },

  // Image Upload
  uploadImage: async (formData) => {
    if (USE_MOCK) {
      return { data: { url: 'https://via.placeholder.com/800x400', success: true } };
    }
    return axiosInstance.post('/upload/image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // System Settings
  getSettings: async () => {
    if (USE_MOCK) {
      return { data: mockAdminData.settings || {
        allowRegistration: true,
        requireEmailVerification: true,
        alumniVerificationRequired: true,
        maxUploadSize: 10,
        maintenanceMode: false,
      }};
    }
    return axiosInstance.get('/admin/settings/');
  },

  updateSettings: async (settings) => {
    if (USE_MOCK) {
      return { data: { success: true, ...settings } };
    }
    return axiosInstance.put('/admin/settings/', settings);
  },

  // Analytics
  getDashboardStats: async () => {
    if (USE_MOCK) {
      return { data: mockAdminData.stats || {
        totalUsers: 6250,
        verifiedAlumni: 2850,
        pendingVerifications: 45,
        activeEvents: 12,
        jobPostings: 156,
        reportedIssues: 3,
      }};
    }
    return axiosInstance.get('/dashboard/stats/');
  },

  // Recent Activity
  getRecentUsers: async (limit = 10) => {
    if (USE_MOCK) {
      return { data: [] };
    }
    return axiosInstance.get('/admin/recent-users/', { params: { limit } });
  },

  // Get all users list (for manage users page)
  getAllUsers: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAdminData.users || [] };
    }
    return axiosInstance.get('/users/', { params: filters });
  },
};

export default adminApi;
