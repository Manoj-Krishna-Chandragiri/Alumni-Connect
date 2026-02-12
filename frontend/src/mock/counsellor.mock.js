// Mock counsellor API functions
import { mockStudents, mockDashboardStats } from '../data/adminMockData';
import { mockAlumni, mockEvents } from '../data/mockData';

// Mock counsellor data object for API compatibility
export const mockCounsellorData = {
  students: mockStudents,
  alumni: mockAlumni,
  events: mockEvents,
  stats: {
    totalStudents: 1250,
    verifiedAlumni: 856,
    placements: 324,
    placementRate: 78,
  },
  insights: {
    totalStudents: 1250,
    activeMentorships: 145,
    upcomingSessions: 28,
    placementRate: 78,
    careerInterests: [
      { interest: 'Software Development', count: 450 },
      { interest: 'Data Science', count: 280 },
      { interest: 'Product Management', count: 180 },
      { interest: 'Finance', count: 120 },
      { interest: 'Consulting', count: 100 },
      { interest: 'Others', count: 120 },
    ],
    topSkills: [
      { skill: 'Python', students: 520 },
      { skill: 'JavaScript', students: 480 },
      { skill: 'Machine Learning', students: 320 },
      { skill: 'SQL', students: 400 },
      { skill: 'React', students: 280 },
    ],
  },
};

export const mockGetDashboardStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockDashboardStats.counsellor };
};

export const mockGetStudents = async (filters = {}) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  let filteredStudents = [...mockStudents];
  
  if (filters.department) {
    filteredStudents = filteredStudents.filter(
      (s) => s.department.toLowerCase().includes(filters.department.toLowerCase())
    );
  }
  
  if (filters.year) {
    filteredStudents = filteredStudents.filter(
      (s) => s.year === parseInt(filters.year)
    );
  }
  
  if (filters.cgpaMin) {
    filteredStudents = filteredStudents.filter(
      (s) => s.cgpa >= parseFloat(filters.cgpaMin)
    );
  }
  
  return { data: filteredStudents };
};

export const mockGetAlumni = async (filters = {}) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  let filteredAlumni = [...mockAlumni];
  
  if (filters.department) {
    filteredAlumni = filteredAlumni.filter(
      (a) => a.department.toLowerCase().includes(filters.department.toLowerCase())
    );
  }
  
  if (filters.graduationYear) {
    filteredAlumni = filteredAlumni.filter(
      (a) => a.graduationYear === parseInt(filters.graduationYear)
    );
  }
  
  if (filters.verified === 'true') {
    filteredAlumni = filteredAlumni.filter((a) => a.verified);
  } else if (filters.verified === 'false') {
    filteredAlumni = filteredAlumni.filter((a) => !a.verified);
  }
  
  return { data: filteredAlumni };
};

export const mockGetEvents = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockEvents };
};

export const mockGetPlacementTrends = async () => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    data: [
      { month: 'Jan', placements: 45, internships: 30, higherStudies: 15 },
      { month: 'Feb', placements: 52, internships: 35, higherStudies: 18 },
      { month: 'Mar', placements: 48, internships: 42, higherStudies: 20 },
      { month: 'Apr', placements: 61, internships: 38, higherStudies: 22 },
      { month: 'May', placements: 55, internships: 45, higherStudies: 25 },
      { month: 'Jun', placements: 67, internships: 50, higherStudies: 28 },
    ],
  };
};

export default {
  mockGetDashboardStats,
  mockGetStudents,
  mockGetAlumni,
  mockGetEvents,
  mockGetPlacementTrends,
};
