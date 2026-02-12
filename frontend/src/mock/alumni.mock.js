// Mock alumni API functions
import { mockBlogs, mockJobs, mockEvents, mockAlumni } from '../data/mockData';

// Alumni's own blogs
let myBlogs = [
  {
    id: '101',
    title: 'My Journey from Campus to Google',
    excerpt: 'How I prepared for tech interviews while in college.',
    content: '<p>It all started in my third year...</p>',
    category: 'Career',
    tags: ['Career', 'Google', 'Interview'],
    readTime: 7,
    likes: 89,
    comments: 12,
    createdAt: '2024-01-05T10:00:00Z',
    published: true,
  },
];

// Alumni's own jobs
let myJobs = [
  {
    id: '101',
    title: 'Frontend Developer Intern',
    company: 'Google',
    location: 'Bangalore, India',
    type: 'internship',
    salary: '80K/month',
    description: 'Join our team to work on exciting web projects.',
    requirements: ['React', 'JavaScript', 'CSS'],
    skills: ['React', 'TypeScript', 'CSS'],
    deadline: '2024-02-28',
    createdAt: '2024-01-10T10:00:00Z',
    applicants: 23,
  },
];

// Mock alumni profile data
const alumniProfile = {
  id: '2',
  firstName: 'Priya',
  lastName: 'Sharma',
  email: 'priya.sharma@gmail.com',
  phone: '+91 9876543211',
  department: 'Computer Science',
  graduationYear: 2018,
  company: 'Google',
  jobTitle: 'Senior Software Engineer',
  location: 'Bangalore, India',
  bio: 'Passionate about building scalable systems and mentoring students.',
  skills: ['JavaScript', 'Python', 'Machine Learning', 'System Design'],
  linkedin: 'https://linkedin.com/in/priyasharma',
  github: 'https://github.com/priyasharma',
};

// Mock alumni data object for API compatibility
export const mockAlumniData = {
  profile: alumniProfile,
  alumni: mockAlumni,
  jobs: mockJobs,
  myJobs: myJobs,
  blogs: mockBlogs,
  myBlogs: myBlogs,
  events: mockEvents,
};

export const mockGetBlogs = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockBlogs };
};

export const mockGetMyBlogs = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: myBlogs };
};

export const mockCreateBlog = async (blogData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newBlog = {
    id: String(Date.now()),
    ...blogData,
    author: {
      id: '2',
      name: 'Priya Sharma',
      company: 'Google',
    },
    likes: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
    published: true,
  };
  myBlogs.push(newBlog);
  return { data: newBlog };
};

export const mockUpdateBlog = async (id, blogData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = myBlogs.findIndex((b) => b.id === id);
  if (index === -1) throw new Error('Blog not found');
  myBlogs[index] = { ...myBlogs[index], ...blogData };
  return { data: myBlogs[index] };
};

export const mockDeleteBlog = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  myBlogs = myBlogs.filter((b) => b.id !== id);
  return { data: { success: true } };
};

export const mockGetJobs = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockJobs };
};

export const mockGetMyJobs = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: myJobs };
};

export const mockCreateJob = async (jobData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newJob = {
    id: String(Date.now()),
    ...jobData,
    postedBy: {
      id: '2',
      name: 'Priya Sharma',
      company: 'Google',
    },
    applicants: 0,
    createdAt: new Date().toISOString(),
  };
  myJobs.push(newJob);
  return { data: newJob };
};

export const mockUpdateJob = async (id, jobData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = myJobs.findIndex((j) => j.id === id);
  if (index === -1) throw new Error('Job not found');
  myJobs[index] = { ...myJobs[index], ...jobData };
  return { data: myJobs[index] };
};

export const mockDeleteJob = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  myJobs = myJobs.filter((j) => j.id !== id);
  return { data: { success: true } };
};

export const mockGetEvents = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockEvents };
};

export const mockGetProfile = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    data: {
      id: '2',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@gmail.com',
      phone: '+91 9876543211',
      department: 'Computer Science',
      graduationYear: 2018,
      company: 'Google',
      jobTitle: 'Senior Software Engineer',
      location: 'Bangalore, India',
      bio: 'Passionate about building scalable systems and mentoring students.',
      skills: ['JavaScript', 'Python', 'Machine Learning', 'System Design'],
      linkedin: 'https://linkedin.com/in/priyasharma',
      github: 'https://github.com/priyasharma',
    },
  };
};

export const mockUpdateProfile = async (profileData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { data: { ...profileData, id: '2' } };
};

export default {
  mockGetBlogs,
  mockGetMyBlogs,
  mockCreateBlog,
  mockUpdateBlog,
  mockDeleteBlog,
  mockGetJobs,
  mockGetMyJobs,
  mockCreateJob,
  mockUpdateJob,
  mockDeleteJob,
  mockGetEvents,
  mockGetProfile,
  mockUpdateProfile,
};
