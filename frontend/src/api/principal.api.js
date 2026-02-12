import axiosInstance from './axiosInstance';
import { mockPrincipalData } from '../mock/principal.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

const principalApi = {
  // All Students
  getAllStudents: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockPrincipalData.students };
    }
    return axiosInstance.get('/principal/students', { params: filters });
  },

  // All Alumni
  getAllAlumni: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockPrincipalData.alumni };
    }
    return axiosInstance.get('/principal/alumni', { params: filters });
  },

  // Institution Analytics
  getInstitutionAnalytics: async () => {
    if (USE_MOCK) {
      return { data: mockPrincipalData.analytics };
    }
    return axiosInstance.get('/principal/analytics');
  },

  // Events
  getEvents: async () => {
    if (USE_MOCK) {
      return { data: mockPrincipalData.events };
    }
    return axiosInstance.get('/principal/events');
  },

  // Department-wise Summary
  getDepartmentSummary: async () => {
    if (USE_MOCK) {
      return { data: mockPrincipalData.departmentSummary };
    }
    return axiosInstance.get('/principal/departments/summary');
  },
};

export default principalApi;
