import axiosInstance from './axiosInstance';

const principalApi = {
  // Institution-wide stats for home dashboard
  getInstitutionStats: async () => {
    return axiosInstance.get('/principal/stats/');
  },

  // All Students (paginated, optional department/search filters)
  getAllStudents: async (filters = {}) => {
    return axiosInstance.get('/principal/students/', { params: filters });
  },

  // All Alumni (paginated, optional department/search filters)
  getAllAlumni: async (filters = {}) => {
    return axiosInstance.get('/principal/alumni/', { params: filters });
  },

  // Institution-wide analytics (for InstitutionAnalytics page)
  getInstitutionInsights: async () => {
    return axiosInstance.get('/principal/insights/');
  },

  // Events (reuse existing events endpoint)
  getEvents: async () => {
    return axiosInstance.get('/events/');
  },
};

export default principalApi;
