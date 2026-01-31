// Mock student API functions
import { mockAlumni, mockBlogs, mockJobs, mockEvents } from '../data/mockData';

// Mock student data object for API compatibility
export const mockStudentData = {
  profile: {
    id: '1',
    firstName: 'Amit',
    lastName: 'Kumar',
    email: 'student@college.edu',
    phone: '+91 9876543210',
    rollNo: 'CS2021001',
    department: 'Computer Science',
    year: 3,
    cgpa: 8.5,
    skills: ['Python', 'JavaScript', 'React', 'Machine Learning'],
    certifications: ['AWS Cloud Practitioner', 'Google Data Analytics'],
    internships: [
      {
        company: 'TechCorp',
        role: 'Software Intern',
        duration: '3 months',
        year: 2023,
      },
    ],
    linkedin: 'https://linkedin.com/in/amitkumar',
    github: 'https://github.com/amitkumar',
    bio: 'Passionate about building scalable applications.',
  },
  alumni: mockAlumni,
  events: mockEvents,
  jobs: mockJobs,
  blogs: mockBlogs,
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
  
  if (filters.industry) {
    filteredAlumni = filteredAlumni.filter(
      (a) => a.industries?.includes(filters.industry)
    );
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredAlumni = filteredAlumni.filter(
      (a) =>
        a.name.toLowerCase().includes(searchLower) ||
        a.company?.toLowerCase().includes(searchLower) ||
        a.skills?.some((s) => s.toLowerCase().includes(searchLower))
    );
  }
  
  return { data: filteredAlumni };
};

export const mockGetAlumniById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const alumni = mockAlumni.find((a) => a.id === id);
  if (!alumni) {
    throw new Error('Alumni not found');
  }
  return { data: alumni };
};

export const mockGetBlogs = async (filters = {}) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  let filteredBlogs = [...mockBlogs];
  
  if (filters.category) {
    filteredBlogs = filteredBlogs.filter(
      (b) => b.category.toLowerCase() === filters.category.toLowerCase()
    );
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredBlogs = filteredBlogs.filter(
      (b) =>
        b.title.toLowerCase().includes(searchLower) ||
        b.tags?.some((t) => t.toLowerCase().includes(searchLower))
    );
  }
  
  return { data: filteredBlogs };
};

export const mockGetJobs = async (filters = {}) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  let filteredJobs = [...mockJobs];
  
  if (filters.type) {
    filteredJobs = filteredJobs.filter((j) => j.type === filters.type);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredJobs = filteredJobs.filter(
      (j) =>
        j.title.toLowerCase().includes(searchLower) ||
        j.company.toLowerCase().includes(searchLower)
    );
  }
  
  return { data: filteredJobs };
};

export const mockGetEvents = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockEvents };
};

export const mockGetProfile = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    data: {
      id: '1',
      firstName: 'Amit',
      lastName: 'Kumar',
      email: 'student@college.edu',
      phone: '+91 9876543210',
      rollNo: 'CS2021001',
      department: 'Computer Science',
      year: 3,
      cgpa: 8.5,
      skills: ['Python', 'JavaScript', 'React', 'Machine Learning'],
      certifications: ['AWS Cloud Practitioner', 'Google Data Analytics'],
      internships: [
        {
          company: 'TechCorp',
          role: 'Software Intern',
          duration: '3 months',
          year: 2023,
        },
      ],
      linkedin: 'https://linkedin.com/in/amitkumar',
      github: 'https://github.com/amitkumar',
      bio: 'Passionate about building scalable applications.',
    },
  };
};

export const mockUpdateProfile = async (profileData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { data: { ...profileData, id: '1' } };
};

export const mockRegisterEvent = async (eventId) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: { success: true, message: 'Registered successfully' } };
};

export const mockApplyJob = async (jobId) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: { success: true, message: 'Application submitted' } };
};

export default {
  mockGetAlumni,
  mockGetAlumniById,
  mockGetBlogs,
  mockGetJobs,
  mockGetEvents,
  mockGetProfile,
  mockUpdateProfile,
  mockRegisterEvent,
  mockApplyJob,
};
