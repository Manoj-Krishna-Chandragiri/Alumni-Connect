import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RequireScope = ({ children, scope, scopes = [], requireAll = false }) => {
  const { user, hasScope, hasAllScopes, hasAnyScope } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Normalize: support both single scope and array of scopes
  const requiredScopes = scope ? [scope] : scopes;

  // Check if user has required scopes
  let hasPermission = false;

  if (requiredScopes.length === 0) {
    hasPermission = true;
  } else if (requireAll) {
    hasPermission = hasAllScopes(requiredScopes);
  } else {
    hasPermission = hasAnyScope(requiredScopes);
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center p-8">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default RequireScope;
