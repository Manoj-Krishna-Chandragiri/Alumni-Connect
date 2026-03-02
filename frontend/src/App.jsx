import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES, SCOPES } from './constants/roles';
import { ErrorBoundary } from './components/shared';

// Layouts
import {
  PublicLayout,
  StudentLayout,
  AlumniLayout,
  CounsellorLayout,
  HODLayout,
  PrincipalLayout,
  AdminLayout,
} from './layouts';

// Auth Pages
import { Login, Register } from './pages/auth';

// Auth Components
import ProtectedRoute from './pages/auth/ProtectedRoute';
import RequireScope from './pages/auth/RequireScope';

// Student Pages
import {
  StudentHome,
  AlumniDirectory,
  Events as StudentEvents,
  Jobs as StudentJobs,
  SavedJobs,
  Profile as StudentProfile,
  AICareer,
} from './pages/student';

// Alumni Pages
import {
  AlumniHome,
  AlumniJobs,
  AlumniBlogs,
  AlumniProfile,
  AlumniSavedItems,
} from './pages/alumni';

// Counsellor Pages
import {
  CounsellorHome,
  CounsellorStudents,
  CounsellorAlumni,
  CounsellingInsights,
  CounsellorProfile,
} from './pages/counsellor';

// HOD Pages
import { HODHome, DepartmentAnalytics, HODStudents, HODAlumni, HODProfile } from './pages/hod';

// Principal Pages
import { PrincipalHome, InstitutionAnalytics, PrincipalStudents, PrincipalAlumni, PrincipalProfile } from './pages/principal';

// Admin Pages
import {
  AdminHome,
  VerifyAlumni,
  ManageUsers,
  ManageEvents,
  ManageStudents,
  ManageAlumni,
  SystemSettings,
  AdminProfile,
} from './pages/admin';

// Common Pages
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentHome />} />
          <Route path="home" element={<StudentHome />} />
          <Route
            path="alumni"
            element={
              <RequireScope scope={SCOPES.VIEW_ALUMNI}>
                <AlumniDirectory />
              </RequireScope>
            }
          />
          <Route
            path="events"
            element={
              <RequireScope scope={SCOPES.VIEW_EVENTS}>
                <StudentEvents />
              </RequireScope>
            }
          />
          <Route
            path="jobs"
            element={
              <RequireScope scope={SCOPES.VIEW_JOBS}>
                <StudentJobs />
              </RequireScope>
            }
          />
          <Route
            path="saved-jobs"
            element={
              <RequireScope scope={SCOPES.VIEW_JOBS}>
                <SavedJobs />
              </RequireScope>
            }
          />
          <Route
            path="career"
            element={
              <RequireScope scope={SCOPES.AI_RECOMMENDATIONS}>
                <AICareer />
              </RequireScope>
            }
          />
          <Route
            path="profile"
            element={
              <RequireScope scope={SCOPES.EDIT_PROFILE}>
                <StudentProfile />
              </RequireScope>
            }
          />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Alumni Routes */}
        <Route
          path="/alumni"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ALUMNI]}>
              <AlumniLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AlumniHome />} />
          <Route path="home" element={<AlumniHome />} />
          <Route
            path="jobs"
            element={
              <RequireScope scope={SCOPES.POST_JOB}>
                <AlumniJobs />
              </RequireScope>
            }
          />
          <Route
            path="blogs"
            element={
              <RequireScope scope={SCOPES.POST_BLOG}>
                <AlumniBlogs />
              </RequireScope>
            }
          />
          <Route
            path="events"
            element={
              <RequireScope scope={SCOPES.VIEW_EVENTS}>
                <StudentEvents />
              </RequireScope>
            }
          />
          <Route
            path="directory"
            element={
              <RequireScope scope={SCOPES.VIEW_ALUMNI}>
                <AlumniDirectory />
              </RequireScope>
            }
          />
          <Route
            path="profile"
            element={
              <RequireScope scope={SCOPES.EDIT_PROFILE}>
                <AlumniProfile />
              </RequireScope>
            }
          />
          <Route path="settings" element={<Settings />} />
          <Route path="saved" element={<AlumniSavedItems />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Counsellor Routes */}
        <Route
          path="/counsellor"
          element={
            <ProtectedRoute allowedRoles={[ROLES.COUNSELLOR]}>
              <CounsellorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CounsellorHome />} />
          <Route path="home" element={<CounsellorHome />} />
          <Route
            path="students"
            element={
              <RequireScope scope={SCOPES.VIEW_STUDENTS}>
                <CounsellorStudents />
              </RequireScope>
            }
          />
          <Route
            path="alumni"
            element={
              <RequireScope scope={SCOPES.VIEW_ALUMNI}>
                <CounsellorAlumni />
              </RequireScope>
            }
          />
          <Route
            path="insights"
            element={
              <RequireScope scope={SCOPES.VIEW_COUNSELLING_INSIGHTS}>
                <CounsellingInsights />
              </RequireScope>
            }
          />
          <Route
            path="events"
            element={
              <RequireScope scope={SCOPES.VIEW_EVENTS}>
                <StudentEvents />
              </RequireScope>
            }
          />
          <Route path="profile" element={<CounsellorProfile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* HOD Routes */}
        <Route
          path="/hod"
          element={
            <ProtectedRoute allowedRoles={[ROLES.HOD]}>
              <HODLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HODHome />} />
          <Route path="home" element={<HODHome />} />
          <Route
            path="students"
            element={
              <RequireScope scope={SCOPES.VIEW_STUDENTS}>
                <HODStudents />
              </RequireScope>
            }
          />
          <Route
            path="alumni"
            element={
              <RequireScope scope={SCOPES.VIEW_ALUMNI}>
                <HODAlumni />
              </RequireScope>
            }
          />
          <Route
            path="analytics"
            element={
              <RequireScope scope={SCOPES.VIEW_DEPARTMENT_ANALYTICS}>
                <DepartmentAnalytics />
              </RequireScope>
            }
          />
          <Route
            path="events"
            element={
              <RequireScope scope={SCOPES.VIEW_EVENTS}>
                <StudentEvents />
              </RequireScope>
            }
          />
          <Route path="profile" element={<HODProfile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Principal Routes */}
        <Route
          path="/principal"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PRINCIPAL]}>
              <PrincipalLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PrincipalHome />} />
          <Route path="home" element={<PrincipalHome />} />
          <Route
            path="students"
            element={
              <RequireScope scope={SCOPES.VIEW_STUDENTS}>
                <PrincipalStudents />
              </RequireScope>
            }
          />
          <Route
            path="alumni"
            element={
              <RequireScope scope={SCOPES.VIEW_ALUMNI}>
                <PrincipalAlumni />
              </RequireScope>
            }
          />
          <Route
            path="analytics"
            element={
              <RequireScope scope={SCOPES.VIEW_INSTITUTION_ANALYTICS}>
                <InstitutionAnalytics />
              </RequireScope>
            }
          />
          <Route
            path="events"
            element={
              <RequireScope scope={SCOPES.VIEW_EVENTS}>
                <StudentEvents />
              </RequireScope>
            }
          />
          <Route path="profile" element={<PrincipalProfile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="home" element={<AdminHome />} />
          <Route
            path="verify-alumni"
            element={
              <RequireScope scope={SCOPES.VERIFY_ALUMNI}>
                <VerifyAlumni />
              </RequireScope>
            }
          />
          <Route
            path="users"
            element={
              <RequireScope scope={SCOPES.MANAGE_USERS}>
                <ManageUsers />
              </RequireScope>
            }
          />
          <Route
            path="students"
            element={
              <RequireScope scope={SCOPES.MANAGE_STUDENTS}>
                <ManageStudents />
              </RequireScope>
            }
          />
          <Route
            path="alumni"
            element={
              <RequireScope scope={SCOPES.MANAGE_ALUMNI}>
                <ManageAlumni />
              </RequireScope>
            }
          />
          <Route
            path="events"
            element={
              <RequireScope scope={SCOPES.MANAGE_EVENTS}>
                <ManageEvents />
              </RequireScope>
            }
          />
          <Route
            path="settings"
            element={
              <RequireScope scope={SCOPES.MANAGE_SYSTEM}>
                <SystemSettings />
              </RequireScope>
            }
          />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Global 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
