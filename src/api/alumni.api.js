import axiosInstance from './axiosInstance';
import { mockAlumniData } from '../mock/alumni.mock';

const USE_MOCK = true;

const alumniApi = {
  // Profile
  getProfile: async () => {
    if (USE_MOCK) {
      return { data: mockAlumniData.profile || {} };
    }
    return axiosInstance.get('/alumni/profile/');
  },

  updateProfile: async (profileData) => {
    if (USE_MOCK) {
      return { data: { ...mockAlumniData.profile, ...profileData } };
    }
    return axiosInstance.put('/alumni/profile/', profileData);
  },

  // Alumni Directory
  getAlumniDirectory: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAlumniData.alumni || [] };
    }
    return axiosInstance.get('/alumni/directory/', { params: filters });
  },

  // Jobs
  getJobs: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAlumniData.jobs || [] };
    }
    return axiosInstance.get('/alumni/jobs/', { params: filters });
  },

  getMyJobs: async () => {
    if (USE_MOCK) {
      return { data: mockAlumniData.myJobs || [] };
    }
    return axiosInstance.get('/alumni/jobs/my/');
  },

  createJob: async (jobData) => {
    if (USE_MOCK) {
      const newJob = { id: String(Date.now()), ...jobData, createdAt: new Date().toISOString() };
      return { data: newJob };
    }
    return axiosInstance.post('/alumni/jobs/', jobData);
  },

  updateJob: async (id, jobData) => {
    if (USE_MOCK) {
      return { data: { success: true, id, ...jobData } };
    }
    return axiosInstance.put(`/alumni/jobs/${id}/`, jobData);
  },

  deleteJob: async (id) => {
    if (USE_MOCK) {
      return { data: { success: true, id } };
    }
    return axiosInstance.delete(`/alumni/jobs/${id}/`);
  },

  // Blogs
  getBlogs: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAlumniData.blogs || [] };
    }
    return axiosInstance.get('/alumni/blogs/', { params: filters });
  },

  getMyBlogs: async () => {
    if (USE_MOCK) {
      return { data: mockAlumniData.myBlogs || [] };
    }
    return axiosInstance.get('/alumni/blogs/my/');
  },

  createBlog: async (blogData) => {
    if (USE_MOCK) {
      const newBlog = { id: String(Date.now()), ...blogData, createdAt: new Date().toISOString() };
      return { data: newBlog };
    }
    return axiosInstance.post('/alumni/blogs/', blogData);
  },

  updateBlog: async (id, blogData) => {
    if (USE_MOCK) {
      return { data: { success: true, id, ...blogData } };
    }
    return axiosInstance.put(`/alumni/blogs/${id}/`, blogData);
  },

  deleteBlog: async (id) => {
    if (USE_MOCK) {
      return { data: { success: true, id } };
    }
    return axiosInstance.delete(`/alumni/blogs/${id}/`);
  },

  // Events
  getEvents: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAlumniData.events || [] };
    }
    return axiosInstance.get('/alumni/events/', { params: filters });
  },
};

export default alumniApi;
