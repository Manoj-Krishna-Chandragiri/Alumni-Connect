// Mock admin API functions
import { mockEvents, mockAlumni } from '../data/mockData';
import { mockUsers, mockPendingAlumni, mockDashboardStats, mockStudents } from '../data/adminMockData';

let users = [...mockUsers];
let pendingAlumni = [...mockPendingAlumni];
let events = [...mockEvents];

// Mock admin data object for API compatibility
export const mockAdminData = {
  pendingAlumni: mockPendingAlumni,
  students: mockStudents,
  alumni: mockAlumni,
  users: mockUsers,
  events: mockEvents,
  settings: {
    allowRegistration: true,
    requireEmailVerification: true,
    alumniVerificationRequired: true,
    maxUploadSize: 10,
    maintenanceMode: false,
  },
  stats: mockDashboardStats.admin,
};

export const mockGetDashboardStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockDashboardStats.admin };
};

export const mockGetPendingAlumni = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: pendingAlumni };
};

export const mockVerifyAlumni = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  pendingAlumni = pendingAlumni.filter((a) => a.id !== id);
  return { data: { success: true, message: 'Alumni verified successfully' } };
};

export const mockRejectAlumni = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  pendingAlumni = pendingAlumni.filter((a) => a.id !== id);
  return { data: { success: true, message: 'Alumni rejected' } };
};

export const mockGetUsers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: users };
};

export const mockUpdateUser = async (id, userData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) throw new Error('User not found');
  users[index] = { ...users[index], ...userData };
  return { data: users[index] };
};

export const mockDeleteUser = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  users = users.filter((u) => u.id !== id);
  return { data: { success: true } };
};

export const mockToggleUserStatus = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) throw new Error('User not found');
  users[index].active = !users[index].active;
  return { data: users[index] };
};

export const mockGetEvents = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: events };
};

export const mockCreateEvent = async (eventData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newEvent = {
    id: String(Date.now()),
    ...eventData,
    registrations: 0,
    createdAt: new Date().toISOString(),
  };
  events.push(newEvent);
  return { data: newEvent };
};

export const mockUpdateEvent = async (id, eventData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) throw new Error('Event not found');
  events[index] = { ...events[index], ...eventData };
  return { data: events[index] };
};

export const mockDeleteEvent = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  events = events.filter((e) => e.id !== id);
  return { data: { success: true } };
};

export default {
  mockGetDashboardStats,
  mockGetPendingAlumni,
  mockVerifyAlumni,
  mockRejectAlumni,
  mockGetUsers,
  mockUpdateUser,
  mockDeleteUser,
  mockToggleUserStatus,
  mockGetEvents,
  mockCreateEvent,
  mockUpdateEvent,
  mockDeleteEvent,
};
