import axiosInstance from './axiosInstance';
import { mockCounsellorData } from '../mock/counsellor.mock';

const USE_MOCK = true;

const counsellorApi = {
  // Dashboard Stats
  getDashboardStats: async () => {
    if (USE_MOCK) {
      return { data: mockCounsellorData.stats || {
        totalStudents: 1250,
        verifiedAlumni: 856,
        placements: 324,
        placementRate: 78,
      }};
    }
    return axiosInstance.get('/counsellor/stats/');
  },

  // Student Directory
  getStudents: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockCounsellorData.students || [] };
    }
    return axiosInstance.get('/counsellor/students/', { params: filters });
  },

  getStudentById: async (id) => {
    if (USE_MOCK) {
      const student = mockCounsellorData.students?.find(s => s.id === id);
      return { data: student || null };
    }
    return axiosInstance.get(`/counsellor/students/${id}/`);
  },

  // Alumni Directory
  getAlumni: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockCounsellorData.alumni || [] };
    }
    return axiosInstance.get('/counsellor/alumni/', { params: filters });
  },

  // Counselling Insights
  getCounsellingInsights: async () => {
    if (USE_MOCK) {
      return { data: mockCounsellorData.insights || {} };
    }
    return axiosInstance.get('/counsellor/insights/');
  },

  // Events
  getEvents: async () => {
    if (USE_MOCK) {
      return { data: mockCounsellorData.events || [] };
    }
    return axiosInstance.get('/counsellor/events/');
  },
};

export default counsellorApi;
