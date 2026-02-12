import axiosInstance from './axiosInstance';
import { mockHODData } from '../mock/hod.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

const hodApi = {
  // Department Students
  getDepartmentStudents: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockHODData.students };
    }
    return axiosInstance.get('/hod/students', { params: filters });
  },

  // Department Alumni
  getDepartmentAlumni: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockHODData.alumni };
    }
    return axiosInstance.get('/hod/alumni', { params: filters });
  },

  // Department Analytics
  getDepartmentAnalytics: async () => {
    if (USE_MOCK) {
      return { data: mockHODData.analytics };
    }
    return axiosInstance.get('/hod/analytics');
  },

  // Events
  getEvents: async () => {
    if (USE_MOCK) {
      return { data: mockHODData.events };
    }
    return axiosInstance.get('/hod/events');
  },
};

export default hodApi;
