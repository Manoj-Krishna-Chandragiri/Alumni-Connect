import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Not logged in, redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // User's role is not authorized, redirect to their dashboard
    const roleRedirects = {
      student: '/student',
      alumni: '/alumni',
      counsellor: '/counsellor',
      hod: '/hod',
      principal: '/principal',
      admin: '/admin',
    };
    return <Navigate to={roleRedirects[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
