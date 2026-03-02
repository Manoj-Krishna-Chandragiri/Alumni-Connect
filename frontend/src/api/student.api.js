import axiosInstance from './axiosInstance';
import { mockStudentData } from '../mock/student.mock';

const USE_MOCK = false;

const studentApi = {
  // Profile
  getProfile: async () => {
    if (USE_MOCK) {
      return { data: mockStudentData.profile || {} };
    }
    return axiosInstance.get('/students/profile/');
  },

  updateProfile: async (profileData) => {
    if (USE_MOCK) {
      return { data: { ...mockStudentData.profile, ...profileData } };
    }
    return axiosInstance.patch('/students/profile/', profileData);
  },

  // Alumni Directory
  getAlumniDirectory: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockStudentData.alumni || [] };
    }
    return axiosInstance.get('/alumni/', { params: filters });
  },

  getAlumniById: async (id) => {
    if (USE_MOCK) {
      const alumni = mockStudentData.alumni?.find(a => a.id === id);
      return { data: alumni || null };
    }
    return axiosInstance.get(`/alumni/${id}/`);
  },

  // Events
  getEvents: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockStudentData.events || [] };
    }
    return axiosInstance.get('/events/', { params: filters });
  },

  registerForEvent: async (eventId) => {
    if (USE_MOCK) {
      return { data: { success: true, eventId } };
    }
    return axiosInstance.post(`/events/${eventId}/register/`);
  },

  // Jobs
  getJobs: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockStudentData.jobs || [] };
    }
    return axiosInstance.get('/jobs/', { params: filters });
  },

  saveJob: async (jobId) => {
    if (USE_MOCK) {
      return { data: { success: true, isSaved: true } };
    }
    return axiosInstance.post(`/jobs/${jobId}/save/`);
  },

  unsaveJob: async (jobId) => {
    if (USE_MOCK) {
      return { data: { success: true, isSaved: false } };
    }
    return axiosInstance.post(`/jobs/${jobId}/save/`); // Same endpoint, it toggles
  },

  getSavedJobs: async () => {
    if (USE_MOCK) {
      return { data: { jobs: [], count: 0 } };
    }
    return axiosInstance.get('/jobs/saved/');
  },

  // Blogs
  getBlogs: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockStudentData.blogs || [] };
    }
    return axiosInstance.get('/blogs/', { params: filters });
  },

  getBlogById: async (id) => {
    if (USE_MOCK) {
      const blog = mockStudentData.blogs?.find(b => b.id === id);
      return { data: blog || null };
    }
    return axiosInstance.get(`/blogs/${id}/`);
  },

  // Blog Interactions
  likeBlog: async (id) => {
    if (USE_MOCK) {
      return { data: { success: true, liked: true, likes_count: 1 } };
    }
    return axiosInstance.post(`/blogs/${id}/like/`);
  },

  saveBlog: async (id) => {
    if (USE_MOCK) {
      return { data: { success: true, saved: true } };
    }
    return axiosInstance.post(`/blogs/${id}/save/`);
  },

  getSavedBlogs: async () => {
    if (USE_MOCK) {
      return { data: [] };
    }
    return axiosInstance.get('/blogs/saved/');
  },

  getBlogComments: async (id) => {
    if (USE_MOCK) {
      return { data: [] };
    }
    return axiosInstance.get(`/blogs/${id}/comments/`);
  },

  addBlogComment: async (id, commentData) => {
    if (USE_MOCK) {
      return { data: { id: Date.now(), ...commentData, created_at: new Date().toISOString() } };
    }
    return axiosInstance.post(`/blogs/${id}/comments/`, commentData);
  },

  shareBlog: async (id, shareData) => {
    if (USE_MOCK) {
      return { data: { success: true, message: 'Blog shared' } };
    }
    return axiosInstance.post(`/blogs/${id}/share/`, shareData);
  },

  // AI Recommendations
  getRecommendedAlumni: async () => {
    if (USE_MOCK) {
      return { data: mockStudentData.recommendedAlumni || [] };
    }
    return axiosInstance.get('/ai/mentors/', { params: { limit: 3 } });
  },

  getCareerRecommendations: async () => {
    if (USE_MOCK) {
      return { data: mockStudentData.careerRecommendations || {} };
    }
    return axiosInstance.get('/ai/career-recommendation/');
  },
};

export default studentApi;
