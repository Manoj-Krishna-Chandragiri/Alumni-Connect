import axiosInstance from './axiosInstance';
import { mockStudentData } from '../mock/student.mock';

const USE_MOCK = true;

const studentApi = {
  // Profile
  getProfile: async () => {
    if (USE_MOCK) {
      return { data: mockStudentData.profile || {} };
    }
    return axiosInstance.get('/student/profile/');
  },

  updateProfile: async (profileData) => {
    if (USE_MOCK) {
      return { data: { ...mockStudentData.profile, ...profileData } };
    }
    return axiosInstance.put('/student/profile/', profileData);
  },

  // Alumni Directory
  getAlumniDirectory: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockStudentData.alumni || [] };
    }
    return axiosInstance.get('/student/alumni/', { params: filters });
  },

  getAlumniById: async (id) => {
    if (USE_MOCK) {
      const alumni = mockStudentData.alumni?.find(a => a.id === id);
      return { data: alumni || null };
    }
    return axiosInstance.get(`/student/alumni/${id}/`);
  },

  // Events
  getEvents: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockStudentData.events || [] };
    }
    return axiosInstance.get('/student/events/', { params: filters });
  },

  registerForEvent: async (eventId) => {
    if (USE_MOCK) {
      return { data: { success: true, eventId } };
    }
    return axiosInstance.post(`/student/events/${eventId}/register/`);
  },

  // Jobs
  getJobs: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockStudentData.jobs || [] };
    }
    return axiosInstance.get('/student/jobs/', { params: filters });
  },

  // Blogs
  getBlogs: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockStudentData.blogs || [] };
    }
    return axiosInstance.get('/student/blogs/', { params: filters });
  },

  getBlogById: async (id) => {
    if (USE_MOCK) {
      const blog = mockStudentData.blogs?.find(b => b.id === id);
      return { data: blog || null };
    }
    return axiosInstance.get(`/student/blogs/${id}/`);
  },
};

export default studentApi;
