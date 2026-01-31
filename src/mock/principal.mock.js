// Mock Principal API functions
import { mockDashboardStats, mockStudents } from '../data/adminMockData';
import { mockAlumni, mockEvents } from '../data/mockData';

// Mock principal data object for API compatibility
export const mockPrincipalData = {
  students: mockStudents,
  alumni: mockAlumni,
  events: mockEvents,
  analytics: {
    departmentStats: [
      { department: 'CSE', students: 450, alumni: 1200, placements: 85 },
      { department: 'ECE', students: 380, alumni: 980, placements: 78 },
      { department: 'ME', students: 320, alumni: 850, placements: 72 },
      { department: 'CE', students: 280, alumni: 720, placements: 68 },
      { department: 'EE', students: 250, alumni: 650, placements: 75 },
    ],
    placementTrends: [
      { year: '2019', placements: 820, avgPackage: 12, topPackage: 45 },
      { year: '2020', placements: 780, avgPackage: 11, topPackage: 42 },
      { year: '2021', placements: 850, avgPackage: 14, topPackage: 55 },
      { year: '2022', placements: 920, avgPackage: 16, topPackage: 65 },
      { year: '2023', placements: 980, avgPackage: 18, topPackage: 75 },
    ],
    alumniDistribution: [
      { name: 'Software/IT', value: 35, color: '#6366f1' },
      { name: 'Finance/Banking', value: 15, color: '#10b981' },
      { name: 'Consulting', value: 12, color: '#f59e0b' },
      { name: 'Manufacturing', value: 10, color: '#ef4444' },
      { name: 'Research/Academia', value: 8, color: '#8b5cf6' },
      { name: 'Startups', value: 12, color: '#ec4899' },
      { name: 'Others', value: 8, color: '#6b7280' },
    ],
    globalPresence: [
      { country: 'India', alumni: 18500 },
      { country: 'USA', alumni: 4500 },
      { country: 'UK', alumni: 1200 },
      { country: 'Germany', alumni: 800 },
      { country: 'Canada', alumni: 750 },
      { country: 'Others', alumni: 2750 },
    ],
  },
  departmentSummary: [
    { name: 'Computer Science', students: 450, alumni: 1200, placement: 92 },
    { name: 'Electronics', students: 380, alumni: 980, placement: 85 },
    { name: 'Mechanical', students: 320, alumni: 850, placement: 78 },
    { name: 'Civil', students: 280, alumni: 720, placement: 72 },
    { name: 'Electrical', students: 250, alumni: 650, placement: 80 },
  ],
};

export const mockGetInstitutionStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockDashboardStats.principal };
};

export const mockGetInstitutionAnalytics = async () => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    data: {
      departmentStats: [
        { department: 'CSE', students: 450, alumni: 1200, placements: 85 },
        { department: 'ECE', students: 380, alumni: 980, placements: 78 },
        { department: 'ME', students: 320, alumni: 850, placements: 72 },
        { department: 'CE', students: 280, alumni: 720, placements: 68 },
        { department: 'EE', students: 250, alumni: 650, placements: 75 },
      ],
      placementTrends: [
        { year: '2019', placements: 820, avgPackage: 12, topPackage: 45 },
        { year: '2020', placements: 780, avgPackage: 11, topPackage: 42 },
        { year: '2021', placements: 850, avgPackage: 14, topPackage: 55 },
        { year: '2022', placements: 920, avgPackage: 16, topPackage: 65 },
        { year: '2023', placements: 980, avgPackage: 18, topPackage: 75 },
      ],
      alumniDistribution: [
        { name: 'Software/IT', value: 35, color: '#6366f1' },
        { name: 'Finance/Banking', value: 15, color: '#10b981' },
        { name: 'Consulting', value: 12, color: '#f59e0b' },
        { name: 'Manufacturing', value: 10, color: '#ef4444' },
        { name: 'Research/Academia', value: 8, color: '#8b5cf6' },
        { name: 'Startups', value: 12, color: '#ec4899' },
        { name: 'Others', value: 8, color: '#6b7280' },
      ],
      globalPresence: [
        { country: 'India', alumni: 18500 },
        { country: 'USA', alumni: 4500 },
        { country: 'UK', alumni: 1200 },
        { country: 'Germany', alumni: 800 },
        { country: 'Canada', alumni: 750 },
        { country: 'Others', alumni: 2750 },
      ],
    },
  };
};

export const mockGetNotableAlumni = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    data: [
      { name: 'Dr. Rajesh Kumar', role: 'CEO, TechCorp', batch: '2005' },
      { name: 'Priya Menon', role: 'VP Engineering, Google', batch: '2008' },
      { name: 'Amit Shah', role: 'Founder, StartupX', batch: '2010' },
      { name: 'Neha Gupta', role: 'Research Lead, MIT', batch: '2012' },
    ],
  };
};

export default {
  mockGetInstitutionStats,
  mockGetInstitutionAnalytics,
  mockGetNotableAlumni,
};
