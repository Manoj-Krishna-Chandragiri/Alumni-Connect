// Mock AI API functions
import { mockRecommendations } from '../data/adminMockData';
import { mockAlumni } from '../data/mockData';

// Mock AI data object for API compatibility
export const mockAIData = {
  recommendations: [
    {
      id: 'rec1',
      type: 'career',
      title: 'Software Engineer',
      company: 'Google',
      match: 92,
      reason: 'Your skills in Python, JavaScript match this role',
    },
    {
      id: 'rec2',
      type: 'skill',
      title: 'Learn TypeScript',
      platform: 'Coursera',
      match: 88,
      reason: 'High demand skill that complements your JavaScript expertise',
    },
    {
      id: 'rec3',
      type: 'event',
      title: 'Tech Career Fair 2024',
      date: '2024-03-15',
      match: 85,
      reason: 'Companies attending match your career interests',
    },
  ],
  suggestedAlumni: mockAlumni.slice(0, 5).map((alumni, index) => ({
    ...alumni,
    matchScore: 95 - index * 5,
    matchReason: 'Similar skills and career path',
  })),
  careerTrends: {
    domains: [
      { name: 'Software Development', growth: 15, demand: 'High' },
      { name: 'Data Science', growth: 22, demand: 'Very High' },
      { name: 'Cloud Computing', growth: 18, demand: 'High' },
      { name: 'Cybersecurity', growth: 20, demand: 'High' },
      { name: 'AI/ML Engineering', growth: 28, demand: 'Very High' },
    ],
    skills: [
      { name: 'Python', demand: 95, trend: 'Rising' },
      { name: 'JavaScript', demand: 90, trend: 'Stable' },
      { name: 'Cloud (AWS/Azure)', demand: 88, trend: 'Rising' },
      { name: 'Machine Learning', demand: 85, trend: 'Rising' },
      { name: 'React', demand: 82, trend: 'Stable' },
    ],
    industries: [
      { name: 'FinTech', hiring: 'Active', avgSalary: '12-25 LPA' },
      { name: 'E-commerce', hiring: 'Moderate', avgSalary: '10-20 LPA' },
      { name: 'HealthTech', hiring: 'Active', avgSalary: '8-18 LPA' },
      { name: 'EdTech', hiring: 'Moderate', avgSalary: '8-16 LPA' },
    ],
  },
  skillAnalysis: {
    currentSkills: [
      { name: 'Python', level: 85, demand: 95 },
      { name: 'JavaScript', level: 80, demand: 90 },
      { name: 'React', level: 75, demand: 82 },
      { name: 'SQL', level: 70, demand: 75 },
    ],
    skillGaps: [
      { skill: 'System Design', importance: 'Critical', suggestedResources: 3 },
      { skill: 'Docker/Kubernetes', importance: 'High', suggestedResources: 5 },
      { skill: 'SQL Optimization', importance: 'Medium', suggestedResources: 4 },
    ],
    recommendations: [
      'Focus on System Design concepts for senior roles',
      'Learn containerization technologies',
      'Practice data structures and algorithms',
    ],
  },
  placementPredictions: {
    overallRate: 85,
    byDepartment: [
      { department: 'Computer Science', rate: 92, placed: 180, total: 195 },
      { department: 'Electronics', rate: 78, placed: 120, total: 154 },
      { department: 'Mechanical', rate: 72, placed: 110, total: 153 },
      { department: 'Civil', rate: 65, placed: 85, total: 131 },
    ],
    topRecruiters: [
      { company: 'TCS', hires: 45 },
      { company: 'Infosys', hires: 38 },
      { company: 'Wipro', hires: 32 },
      { company: 'Google', hires: 12 },
      { company: 'Microsoft', hires: 10 },
    ],
    salaryDistribution: [
      { range: '< 5 LPA', count: 120 },
      { range: '5-10 LPA', count: 250 },
      { range: '10-15 LPA', count: 80 },
      { range: '15-25 LPA', count: 35 },
      { range: '> 25 LPA', count: 10 },
    ],
  },
};

export const mockGetCareerRecommendations = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate AI processing time
  return { data: mockRecommendations };
};

export const mockGetCareerInsights = async () => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    data: {
      suggestedDomains: [
        { name: 'Software Development', matchScore: 92, growth: 'High' },
        { name: 'Data Science', matchScore: 85, growth: 'Very High' },
        { name: 'Cloud Computing', matchScore: 78, growth: 'High' },
      ],
      skillGaps: [
        { skill: 'System Design', importance: 'Critical', resources: 3 },
        { skill: 'Docker/Kubernetes', importance: 'High', resources: 5 },
        { skill: 'SQL Optimization', importance: 'Medium', resources: 4 },
      ],
      marketTrends: [
        { trend: 'AI/ML Integration', relevance: 95 },
        { trend: 'Cloud-Native Development', relevance: 88 },
        { trend: 'DevOps Practices', relevance: 82 },
      ],
    },
  };
};

export const mockGetAlumniMatch = async (alumniId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const alumni = mockAlumni.find((a) => a.id === alumniId);
  if (!alumni) throw new Error('Alumni not found');
  
  return {
    data: {
      alumni,
      matchScore: Math.floor(Math.random() * 30) + 70, // 70-100
      commonSkills: alumni.skills?.slice(0, 3) || [],
      connectionReasons: [
        'Similar academic background',
        'Matching career interests',
        'Expertise in your target domain',
      ],
    },
  };
};

export const mockAnalyzeResume = async (resumeData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    data: {
      score: 78,
      strengths: [
        'Strong technical skills section',
        'Relevant project experience',
        'Clear formatting',
      ],
      improvements: [
        'Add quantifiable achievements',
        'Include more action verbs',
        'Optimize for ATS keywords',
      ],
      suggestedKeywords: ['scalable', 'agile', 'collaborative', 'optimized'],
    },
  };
};

export default {
  mockGetCareerRecommendations,
  mockGetCareerInsights,
  mockGetAlumniMatch,
  mockAnalyzeResume,
};
