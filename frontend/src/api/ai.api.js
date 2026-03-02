import axiosInstance from './axiosInstance';
import { mockAIData } from '../mock/ai.mock';

const USE_MOCK = false;

const aiApi = {
  // Career Recommendations for Students (TF-IDF engine)
  getCareerRecommendations: async (studentId) => {
    if (USE_MOCK) {
      return { data: mockAIData.recommendations };
    }
    const url = studentId ? `/ai/career-recommendation/${studentId}/` : '/ai/career-recommendation/';
    return axiosInstance.get(url);
  },

  // Suggested Alumni based on career match (TF-IDF engine)
  getSuggestedAlumni: async (studentId) => {
    if (USE_MOCK) {
      return { data: mockAIData.suggestedAlumni };
    }
    return axiosInstance.get('/ai/mentors/', { params: { limit: 5 } });
  },

  // Career Trends (for Counsellor/HOD)
  getCareerTrends: async (department = null) => {
    if (USE_MOCK) {
      return { data: mockAIData.careerTrends };
    }
    return axiosInstance.get('/ai/batch-report/', { params: { department } });
  },

  // Skill Analysis (TF-IDF engine)
  getSkillAnalysis: async (studentId) => {
    if (USE_MOCK) {
      return { data: mockAIData.skillAnalysis };
    }
    return axiosInstance.get('/ai/skill-gap/');
  },

  // Placement Predictions (ML engine)
  getPlacementPredictions: async (filters = {}) => {
    if (USE_MOCK) {
      return { data: mockAIData.placementPredictions };
    }
    return axiosInstance.get('/ai/ml/placement/', { params: filters });
  },

  // ML-powered mentor recommendations (XGBoost)
  getMLMentorRecommendations: async (limit = 5) => {
    return axiosInstance.get('/ai/ml/mentors/', { params: { limit } });
  },

  // ML career analysis (XGBoost + LightGBM)
  getMLCareerAnalysis: async () => {
    return axiosInstance.get('/ai/ml/career-analysis/');
  },

  // ML salary prediction
  getMLSalaryPrediction: async () => {
    return axiosInstance.get('/ai/ml/salary/');
  },
};

export default aiApi;
