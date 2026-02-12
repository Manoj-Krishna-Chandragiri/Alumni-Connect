import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ROLE_SCOPES, ROLE_REDIRECT } from '../constants/roles';
import authApi from '../api/auth.api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from stored token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedProfile = localStorage.getItem('profile');
        const token = localStorage.getItem('accessToken');
        
        if (storedUser && token) {
          try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            
            if (decoded.exp > currentTime) {
              const userData = JSON.parse(storedUser);
              setUser({
                ...userData,
                scopes: ROLE_SCOPES[userData.role] || [],
              });
              if (storedProfile) {
                const profileData = JSON.parse(storedProfile);
                setProfile(profileData);
              }
            } else {
              // Token expired - clear storage but don't navigate
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              localStorage.removeItem('profile');
              setUser(null);
              setProfile(null);
            }
          } catch (decodeError) {
            console.error('Token decode error:', decodeError);
            // Invalid token - clear storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('profile');
            setUser(null);
            setProfile(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Don't logout on error, just clear state
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      // Interceptor already unwraps response.data, so response.data contains {tokens, user, profile}
      const { tokens, user: userData, profile: profileData } = response.data;
      
      // Get access token
      const token = tokens.access;
      
      // Decode token to get user info
      const decoded = jwtDecode(token);
      
      const userWithScopes = {
        ...userData,
        ...decoded,
        scopes: ROLE_SCOPES[userData.role] || [],
      };

      // Store in localStorage (token should be HttpOnly cookie in production)
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(userData));
      if (profileData) {
        localStorage.setItem('profile', JSON.stringify(profileData));
        setProfile(profileData);
      }
      
      setUser(userWithScopes);
      
      // Redirect to role-specific dashboard
      const redirectPath = ROLE_REDIRECT[userData.role] || '/';
      navigate(redirectPath);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Login failed',
      };
    }
  }, [navigate]);

  const register = useCallback(async (userData) => {
    try {
      const response = await authApi.register(userData);
      // Interceptor already unwraps response.data
      const data = response.data;
      
      // Auto-login after registration if tokens are provided
      if (data.tokens) {
        const { tokens, user: newUser } = data;
        const token = tokens.access;
        
        const decoded = jwtDecode(token);
        const userWithScopes = {
          ...newUser,
          ...decoded,
          scopes: ROLE_SCOPES[newUser.role] || [],
        };

        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', tokens.refresh);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        setUser(userWithScopes);
        
        const redirectPath = ROLE_REDIRECT[newUser.role] || '/';
        navigate(redirectPath);
      }
      
      return { success: true, data: data };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Registration failed',
      };
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    setUser(null);
    setProfile(null);
    navigate('/login');
  }, [navigate]);

  const hasScope = useCallback((scope) => {
    if (!user || !user.scopes) return false;
    return user.scopes.includes(scope);
  }, [user]);

  const hasAnyScope = useCallback((scopes) => {
    if (!user || !user.scopes) return false;
    return scopes.some(scope => user.scopes.includes(scope));
  }, [user]);

  const hasAllScopes = useCallback((scopes) => {
    if (!user || !user.scopes) return false;
    return scopes.every(scope => user.scopes.includes(scope));
  }, [user]);

  const updateProfile = useCallback((updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('profile', JSON.stringify(updatedProfile));
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    hasScope,
    hasAnyScope,
    hasAllScopes,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
