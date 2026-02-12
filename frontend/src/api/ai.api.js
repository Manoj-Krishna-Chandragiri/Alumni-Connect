import axiosInstance from './axiosInstance';
import { mockAIData } from '../mock/ai.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

const aiApi = {
  // Career Recommendations for Students
  getCareerRecommendations: async (studentId) => {
    if (USE_MOCK) {
      return { data: mockAIData.recommendations };
    }
    return axiosInstance.get(`/ai/recommendations/${studentId}`);
  },

  // Suggested Alumni based on career match
  getSuggestedAlumni: async (studentId) => {
    if (USE_MOCK) {
      return { data: mockAIData.suggestedAlumni };
    }
    return axiosInstance.get(`/ai/suggested-alumni/${studentId}`);
  },

  // Career Trends (for Counsellor/HOD)
  getCareerTrends: async (department = null) => {
    if (USE_MOCK) {
      return { data: mockAIData.careerTrends };
    }
    return axiosInstance.get('/ai/career-trends', { params: { department } });
  },

  // Skill Analysis
  getSkillAnalysis: async (studentId) => {
    if (USE_MOCK) {
      return { data: mockAIData.skillAnalysis };
    }
    return axiosInstance.get(`/ai/skill-analysis/${studentId}`);
  },

  // Placement Predictions
  getPlacementPredictions: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAIData.placementPredictions };
    }
    return axiosInstance.get('/ai/placement-predictions', { params: filters });
  },
};

export default aiApi;
