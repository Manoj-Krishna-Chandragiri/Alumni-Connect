import axiosInstance from './axiosInstance';

const hodApi = {
  // Dashboard stats (students, alumni, counsellors, placements, events)
  getDepartmentStats: async () => axiosInstance.get('/hod/stats/'),

  // Department students (paginated, searchable)
  getDepartmentStudents: async (params = {}) =>
    axiosInstance.get('/hod/students/', { params }),

  // Department alumni (paginated, searchable)
  getDepartmentAlumni: async (params = {}) =>
    axiosInstance.get('/hod/alumni/', { params }),

  // Counsellors under this HOD
  getDepartmentCounsellors: async () => axiosInstance.get('/hod/counsellors/'),

  // Department analytics & insights
  getDepartmentInsights: async () => axiosInstance.get('/hod/insights/'),

  // Alias kept for backward compat
  getDepartmentAnalytics: async () => axiosInstance.get('/hod/insights/'),
};

export default hodApi;
