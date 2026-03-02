import axiosInstance from './axiosInstance';
import { mockAlumniData } from '../mock/alumni.mock';

const USE_MOCK = false;

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
    return axiosInstance.patch('/alumni/profile/', profileData);
  },

  // Alumni Directory
  getAlumniDirectory: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAlumniData.alumni || [] };
    }
    return axiosInstance.get('/alumni/', { params: filters });
  },

  // Jobs
  getJobs: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAlumniData.jobs || [] };
    }
    return axiosInstance.get('/jobs/', { params: filters });
  },

  getMyJobs: async () => {
    if (USE_MOCK) {
      return { data: mockAlumniData.myJobs || [] };
    }
    return axiosInstance.get('/jobs/', { params: { my: true } });
  },

  createJob: async (jobData) => {
    if (USE_MOCK) {
      const newJob = { id: String(Date.now()), ...jobData, createdAt: new Date().toISOString() };
      return { data: newJob };
    }
    return axiosInstance.post('/jobs/', jobData);
  },

  updateJob: async (id, jobData) => {
    if (USE_MOCK) {
      return { data: { success: true, id, ...jobData } };
    }
    return axiosInstance.put(`/jobs/${id}/`, jobData);
  },

  deleteJob: async (id) => {
    if (USE_MOCK) {
      return { data: { success: true, id } };
    }
    return axiosInstance.delete(`/jobs/${id}/`);
  },

  saveJob: async (jobId) => {
    if (USE_MOCK) {
      return { data: { success: true, isSaved: true } };
    }
    return axiosInstance.post(`/jobs/${jobId}/save/`);
  },

  // Blogs
  getBlogs: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAlumniData.blogs || [] };
    }
    return axiosInstance.get('/blogs/', { params: filters });
  },

  getMyBlogs: async () => {
    if (USE_MOCK) {
      return { data: mockAlumniData.myBlogs || [] };
    }
    return axiosInstance.get('/blogs/my/');
  },

  createBlog: async (blogData) => {
    if (USE_MOCK) {
      const newBlog = { id: String(Date.now()), ...blogData, createdAt: new Date().toISOString() };
      return { data: newBlog };
    }
    const { coverImage, ...rest } = blogData;
    return axiosInstance.post('/blogs/', {
      ...rest,
      cover_image: coverImage || '',
      status: blogData.status || 'published',
    });
  },

  updateBlog: async (id, blogData) => {
    if (USE_MOCK) {
      return { data: { success: true, id, ...blogData } };
    }
    const { coverImage, ...rest } = blogData;
    return axiosInstance.put(`/blogs/${id}/`, {
      ...rest,
      cover_image: coverImage || '',
      status: blogData.status || 'published',
    });
  },

  deleteBlog: async (id) => {
    if (USE_MOCK) {
      return { data: { success: true, id } };
    }
    return axiosInstance.delete(`/blogs/${id}/`);
  },

  getBlogById: async (id) => {
    if (USE_MOCK) {
      return { data: mockAlumniData.blogs?.[0] || {} };
    }
    return axiosInstance.get(`/blogs/${id}/`);
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

  getSavedJobs: async () => {
    if (USE_MOCK) {
      return { data: { jobs: [] } };
    }
    return axiosInstance.get('/jobs/saved/');
  },

  // Blog Interactions
  likeBlog: async (id) => {
    if (USE_MOCK) {
      return { data: { success: true, liked: true, likes_count: 1 } };
    }
    return axiosInstance.post(`/blogs/${id}/like/`);
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

  // Upload
  uploadImage: async (formData) => {
    if (USE_MOCK) {
      return { data: { url: 'https://via.placeholder.com/800x400', public_id: 'mock_id' } };
    }
    return axiosInstance.post('/upload/image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Events
  getEvents: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAlumniData.events || [] };
    }
    return axiosInstance.get('/events/', { params: filters });
  },
};

export default alumniApi;
