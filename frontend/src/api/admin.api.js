import axiosInstance from './axiosInstance';
import { mockAdminData } from '../mock/admin.mock';

// Use mock data for now until backend is fully ready
const USE_MOCK = true;

const adminApi = {
  // Users Management (all users)
  getUsers: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAdminData.users || [] };
    }
    return axiosInstance.get('/admin/users/', { params: filters });
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
    return axiosInstance.get('/admin/students/', { params: filters });
  },

  updateStudent: async (id, data) => {
    if (USE_MOCK) {
      return { data: { success: true, ...data } };
    }
    return axiosInstance.put(`/admin/students/${id}/`, data);
  },

  deactivateStudent: async (id) => {
    if (USE_MOCK) {
      return { data: { success: true, id } };
    }
    return axiosInstance.post(`/admin/students/${id}/deactivate/`);
  },

  // Alumni Management
  getAlumni: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAdminData.alumni || [] };
    }
    return axiosInstance.get('/admin/alumni/', { params: filters });
  },

  updateAlumni: async (id, data) => {
    if (USE_MOCK) {
      return { data: { success: true, ...data } };
    }
    return axiosInstance.put(`/admin/alumni/${id}/`, data);
  },

  deactivateAlumni: async (id) => {
    if (USE_MOCK) {
      return { data: { success: true, id } };
    }
    return axiosInstance.post(`/admin/alumni/${id}/deactivate/`);
  },

  // Events Management
  getEvents: async () => {
    if (USE_MOCK) {
      return { data: mockAdminData.events || [] };
    }
    return axiosInstance.get('/admin/events/');
  },

  createEvent: async (eventData) => {
    if (USE_MOCK) {
      const newEvent = { id: Date.now().toString(), ...eventData, createdAt: new Date().toISOString() };
      return { data: newEvent };
    }
    return axiosInstance.post('/admin/events/', eventData);
  },

  updateEvent: async (id, eventData) => {
    if (USE_MOCK) {
      return { data: { success: true, ...eventData } };
    }
    return axiosInstance.put(`/admin/events/${id}/`, eventData);
  },

  deleteEvent: async (id) => {
    if (USE_MOCK) {
      return { data: { success: true, id } };
    }
    return axiosInstance.delete(`/admin/events/${id}/`);
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
    return axiosInstance.get('/admin/stats/');
  },
};

export default adminApi;
