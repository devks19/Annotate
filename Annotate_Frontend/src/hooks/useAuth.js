// hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';

/**
 * Custom hook to access authentication context
 * Provides user data and authentication methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};

/**
 * Custom hook to check if user has specific role
 */
export const useHasRole = (requiredRoles) => {
  const { user } = useAuth();
  
  if (!user) return false;
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(user.role);
  }
  
  return user.role === requiredRoles;
};

/**
 * Custom hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
  const { user } = useAuth();
  return !!user;
};

/**
 * Custom hook to check if user is admin
 */
export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === USER_ROLES.ADMIN;
};

/**
 * Custom hook to check if user is creator
 */
export const useIsCreator = () => {
  const { user } = useAuth();
  return user?.role === USER_ROLES.CREATOR;
};

/**
 * Custom hook to check if user is team member
 */
export const useIsTeamMember = () => {
  const { user } = useAuth();
  return user?.role === USER_ROLES.TEAM;
};

/**
 * Custom hook to get current user ID
 */
export const useUserId = () => {
  const { user } = useAuth();
  return user?.userId;
};

/**
 * Custom hook to get current user's team ID
 */
export const useTeamId = () => {
  const { user } = useAuth();
  return user?.teamId;
};

/**
 * Hook to check if user can access a specific route
 */
export const useCanAccessRoute = (route, allowedRoles) => {
  const { user } = useAuth();
  
  if (!user) return false;
  
  if (!allowedRoles || allowedRoles.length === 0) return true;
  
  return allowedRoles.includes(user.role);
};

export default useAuth;
