// Mock authentication functions
import { ROLES, ROLE_SCOPES } from '../constants/roles';

// Mock user database
const mockUsers = [
  {
    id: '1',
    email: 'student@college.edu',
    password: 'password123',
    firstName: 'Amit',
    lastName: 'Kumar',
    role: ROLES.STUDENT,
    department: 'Computer Science',
    avatar: null,
  },
  {
    id: '2',
    email: 'alumni@gmail.com',
    password: 'password123',
    firstName: 'Priya',
    lastName: 'Sharma',
    role: ROLES.ALUMNI,
    department: 'Computer Science',
    avatar: null,
  },
  {
    id: '3',
    email: 'counsellor@college.edu',
    password: 'password123',
    firstName: 'Dr. Rajesh',
    lastName: 'Iyer',
    role: ROLES.COUNSELLOR,
    department: 'Placement Cell',
    avatar: null,
  },
  {
    id: '4',
    email: 'hod@college.edu',
    password: 'password123',
    firstName: 'Dr. Meera',
    lastName: 'Joshi',
    role: ROLES.HOD,
    department: 'Computer Science',
    avatar: null,
  },
  {
    id: '5',
    email: 'principal@college.edu',
    password: 'password123',
    firstName: 'Dr. Anil',
    lastName: 'Kapoor',
    role: ROLES.PRINCIPAL,
    department: 'Administration',
    avatar: null,
  },
  {
    id: '6',
    email: 'admin@college.edu',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    role: ROLES.ADMIN,
    department: 'IT',
    avatar: null,
  },
];

// Generate mock JWT token
const generateMockToken = (user) => {
  const payload = {
    user_id: user.id,
    email: user.email,
    role: user.role,
    scopes: ROLE_SCOPES[user.role] || [],
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
  };
  // Simple base64 encoding for mock (not real JWT)
  return btoa(JSON.stringify(payload));
};

export const mockLogin = async (email, password) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const token = generateMockToken(user);
  const { password: _, ...userWithoutPassword } = user;

  return {
    data: {
      access: token,
      refresh: token + '_refresh',
      user: {
        ...userWithoutPassword,
        scopes: ROLE_SCOPES[user.role] || [],
      },
    },
  };
};

export const mockRegister = async (userData) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check if email already exists
  if (mockUsers.find((u) => u.email === userData.email)) {
    throw new Error('Email already registered');
  }

  const newUser = {
    id: String(mockUsers.length + 1),
    ...userData,
    avatar: null,
  };

  mockUsers.push(newUser);

  const token = generateMockToken(newUser);
  const { password: _, ...userWithoutPassword } = newUser;

  return {
    data: {
      access: token,
      refresh: token + '_refresh',
      user: {
        ...userWithoutPassword,
        scopes: ROLE_SCOPES[newUser.role] || [],
      },
    },
  };
};

export const mockGetMe = async () => {
  // This would normally decode the token from localStorage
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const payload = JSON.parse(atob(token));
    const user = mockUsers.find((u) => u.id === payload.user_id);
    if (!user) {
      throw new Error('User not found');
    }
    const { password: _, ...userWithoutPassword } = user;
    return {
      data: {
        ...userWithoutPassword,
        scopes: ROLE_SCOPES[user.role] || [],
      },
    };
  } catch {
    throw new Error('Invalid token');
  }
};

export const mockRefreshToken = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const token = localStorage.getItem('token');
  return { data: { access: token } };
};

export default {
  mockLogin,
  mockRegister,
  mockGetMe,
  mockRefreshToken,
};
