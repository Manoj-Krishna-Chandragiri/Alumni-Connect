import { useAuth } from '../../context/AuthContext';

const RequireScope = ({ scope, scopes, requireAll = false, children, fallback = null }) => {
  const { hasScope, hasAnyScope, hasAllScopes } = useAuth();

  // Single scope check
  if (scope) {
    if (!hasScope(scope)) {
      return fallback;
    }
    return children;
  }

  // Multiple scopes check
  if (scopes && scopes.length > 0) {
    const hasAccess = requireAll ? hasAllScopes(scopes) : hasAnyScope(scopes);
    if (!hasAccess) {
      return fallback;
    }
    return children;
  }

  // No scope requirement
  return children;
};

export default RequireScope;
