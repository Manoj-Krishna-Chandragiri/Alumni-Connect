// Mock HOD API functions
import { mockDashboardStats, mockStudents } from '../data/adminMockData';
import { mockAlumni, mockEvents } from '../data/mockData';

// Filter students and alumni for department
const deptStudents = mockStudents.filter(s => s.department === 'Computer Science');
const deptAlumni = mockAlumni.filter(a => a.department === 'Computer Science');

// Mock HOD data object for API compatibility
export const mockHODData = {
  students: deptStudents.length > 0 ? deptStudents : mockStudents.slice(0, 3),
  alumni: deptAlumni.length > 0 ? deptAlumni : mockAlumni.slice(0, 3),
  events: mockEvents,
  analytics: {
    yearWiseStats: [
      { year: '2020', students: 120, placements: 95, higherStudies: 15 },
      { year: '2021', students: 135, placements: 108, higherStudies: 18 },
      { year: '2022', students: 142, placements: 118, higherStudies: 16 },
      { year: '2023', students: 150, placements: 125, higherStudies: 20 },
      { year: '2024', students: 155, placements: 130, higherStudies: 18 },
    ],
    companyWise: [
      { company: 'Google', placements: 12 },
      { company: 'Microsoft', placements: 10 },
      { company: 'Amazon', placements: 15 },
      { company: 'Meta', placements: 8 },
      { company: 'Others', placements: 85 },
    ],
    packageDistribution: [
      { range: '5-10 LPA', count: 45 },
      { range: '10-20 LPA', count: 38 },
      { range: '20-30 LPA', count: 25 },
      { range: '30+ LPA', count: 12 },
    ],
  },
};

export const mockGetDepartmentStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockDashboardStats.hod };
};

export const mockGetDepartmentAnalytics = async () => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    data: {
      yearWiseStats: [
        { year: '2020', students: 120, placements: 95, higherStudies: 15 },
        { year: '2021', students: 135, placements: 108, higherStudies: 18 },
        { year: '2022', students: 142, placements: 118, higherStudies: 16 },
        { year: '2023', students: 150, placements: 125, higherStudies: 20 },
        { year: '2024', students: 155, placements: 130, higherStudies: 18 },
      ],
      companyWise: [
        { company: 'Google', placements: 12 },
        { company: 'Microsoft', placements: 10 },
        { company: 'Amazon', placements: 15 },
        { company: 'Meta', placements: 8 },
        { company: 'Others', placements: 85 },
      ],
      packageDistribution: [
        { range: '5-10 LPA', count: 45 },
        { range: '10-20 LPA', count: 38 },
        { range: '20-30 LPA', count: 25 },
        { range: '30+ LPA', count: 12 },
      ],
    },
  };
};

export const mockGetTopPerformers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    data: [
      { name: 'Priya Sharma', company: 'Google', package: '45 LPA', batch: 2023 },
      { name: 'Vikram Singh', company: 'Meta', package: '50 LPA', batch: 2023 },
      { name: 'Anita Patel', company: 'Amazon', package: '42 LPA', batch: 2023 },
      { name: 'Rahul Kumar', company: 'Microsoft', package: '38 LPA', batch: 2023 },
    ],
  };
};

export default {
  mockGetDepartmentStats,
  mockGetDepartmentAnalytics,
  mockGetTopPerformers,
};
