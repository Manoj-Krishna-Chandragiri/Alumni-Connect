// User Roles
export const ROLES = {
  STUDENT: 'student',
  ALUMNI: 'alumni',
  COUNSELLOR: 'counsellor',
  HOD: 'hod',
  PRINCIPAL: 'principal',
  ADMIN: 'admin',
};

// Permission Scopes
export const SCOPES = {
  // Common scopes (aliases for easier use)
  VIEW_ALUMNI: 'view:alumni',
  VIEW_STUDENTS: 'view:students',
  VIEW_EVENTS: 'view:events',
  VIEW_JOBS: 'view:jobs',
  VIEW_BLOGS: 'view:blogs',
  EDIT_PROFILE: 'edit:profile',
  AI_RECOMMENDATIONS: 'ai:recommendations',

  // Student scopes
  VIEW_ALUMNI_DIRECTORY: 'view:alumni',
  VIEW_OWN_PROFILE: 'view:own_profile',
  EDIT_OWN_PROFILE: 'edit:profile',
  VIEW_AI_RECOMMENDATIONS: 'ai:recommendations',
  REGISTER_EVENTS: 'register:events',
  APPLY_JOBS: 'apply:jobs',

  // Alumni scopes
  POST_JOB: 'post:job',
  POST_BLOG: 'post:blog',
  POST_JOBS: 'post:job',
  POST_BLOGS: 'post:blog',
  EDIT_OWN_JOBS: 'edit:own_jobs',
  EDIT_OWN_BLOGS: 'edit:own_blogs',

  // Counsellor scopes
  VIEW_STUDENT_DIRECTORY: 'view:students',
  VIEW_COUNSELLING_INSIGHTS: 'view:counselling_insights',
  VIEW_CAREER_TRENDS: 'view:career_trends',

  // HOD scopes
  VIEW_DEPARTMENT_STUDENTS: 'view:students',
  VIEW_DEPARTMENT_ALUMNI: 'view:alumni',
  VIEW_DEPARTMENT_ANALYTICS: 'view:department_analytics',

  // Principal scopes
  VIEW_ALL_STUDENTS: 'view:students',
  VIEW_ALL_ALUMNI: 'view:alumni',
  VIEW_INSTITUTION_ANALYTICS: 'view:institution_analytics',

  // Admin scopes
  VERIFY_ALUMNI: 'verify:alumni',
  MANAGE_USERS: 'manage:users',
  MANAGE_STUDENTS: 'manage:students',
  MANAGE_ALUMNI: 'manage:alumni',
  MANAGE_EVENTS: 'manage:events',
  MANAGE_SYSTEM: 'manage:system',
};

// Role to Scopes mapping
export const ROLE_SCOPES = {
  [ROLES.STUDENT]: [
    SCOPES.VIEW_ALUMNI,
    SCOPES.VIEW_EVENTS,
    SCOPES.VIEW_JOBS,
    SCOPES.VIEW_BLOGS,
    SCOPES.VIEW_OWN_PROFILE,
    SCOPES.EDIT_PROFILE,
    SCOPES.AI_RECOMMENDATIONS,
    SCOPES.REGISTER_EVENTS,
    SCOPES.APPLY_JOBS,
  ],
  [ROLES.ALUMNI]: [
    SCOPES.VIEW_ALUMNI,
    SCOPES.VIEW_EVENTS,
    SCOPES.VIEW_JOBS,
    SCOPES.VIEW_BLOGS,
    SCOPES.VIEW_OWN_PROFILE,
    SCOPES.EDIT_PROFILE,
    SCOPES.POST_JOB,
    SCOPES.POST_BLOG,
    SCOPES.EDIT_OWN_JOBS,
    SCOPES.EDIT_OWN_BLOGS,
    SCOPES.REGISTER_EVENTS,
  ],
  [ROLES.COUNSELLOR]: [
    SCOPES.VIEW_STUDENTS,
    SCOPES.VIEW_ALUMNI,
    SCOPES.VIEW_EVENTS,
    SCOPES.VIEW_COUNSELLING_INSIGHTS,
    SCOPES.VIEW_CAREER_TRENDS,
    SCOPES.AI_RECOMMENDATIONS,
  ],
  [ROLES.HOD]: [
    SCOPES.VIEW_STUDENTS,
    SCOPES.VIEW_ALUMNI,
    SCOPES.VIEW_DEPARTMENT_ANALYTICS,
    SCOPES.VIEW_EVENTS,
    SCOPES.VIEW_CAREER_TRENDS,
  ],
  [ROLES.PRINCIPAL]: [
    SCOPES.VIEW_STUDENTS,
    SCOPES.VIEW_ALUMNI,
    SCOPES.VIEW_INSTITUTION_ANALYTICS,
    SCOPES.VIEW_EVENTS,
    SCOPES.VIEW_CAREER_TRENDS,
  ],
  [ROLES.ADMIN]: [
    SCOPES.VERIFY_ALUMNI,
    SCOPES.MANAGE_USERS,
    SCOPES.MANAGE_STUDENTS,
    SCOPES.MANAGE_ALUMNI,
    SCOPES.MANAGE_EVENTS,
    SCOPES.MANAGE_SYSTEM,
    SCOPES.VIEW_STUDENTS,
    SCOPES.VIEW_ALUMNI,
    SCOPES.VIEW_EVENTS,
  ],
};

// Role redirect paths
export const ROLE_REDIRECT = {
  [ROLES.STUDENT]: '/student/home',
  [ROLES.ALUMNI]: '/alumni/home',
  [ROLES.COUNSELLOR]: '/counsellor/home',
  [ROLES.HOD]: '/hod/home',
  [ROLES.PRINCIPAL]: '/principal/home',
  [ROLES.ADMIN]: '/admin/home',
};
