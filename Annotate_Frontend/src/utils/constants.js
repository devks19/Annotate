// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    TIMEOUT: 30000, // 30 seconds
  };
  
  // User Roles
  export const USER_ROLES = {
    ADMIN: 'ADMIN',
    CREATOR: 'CREATOR',
    TEAM: 'TEAM',
    VIEWER: 'VIEWER',
  };
  
  // Feedback Status
  export const FEEDBACK_STATUS = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    RESOLVED: 'RESOLVED',
    REJECTED: 'REJECTED',
  };
  
  // Route Paths
  export const ROUTES = {
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    VIDEOS: '/videos',
    VIDEO_DETAIL: '/videos/:id',
    UPLOAD: '/upload',
    TEAMS: '/teams',
  };
  
  // Role-based Access Control
  export const ROUTE_PERMISSIONS = {
    [ROUTES.DASHBOARD]: [USER_ROLES.ADMIN, USER_ROLES.CREATOR, USER_ROLES.TEAM, USER_ROLES.VIEWER],
    [ROUTES.VIDEOS]: [USER_ROLES.ADMIN, USER_ROLES.CREATOR, USER_ROLES.TEAM, USER_ROLES.VIEWER],
    [ROUTES.VIDEO_DETAIL]: [USER_ROLES.ADMIN, USER_ROLES.CREATOR, USER_ROLES.TEAM, USER_ROLES.VIEWER],
    [ROUTES.UPLOAD]: [USER_ROLES.ADMIN, USER_ROLES.CREATOR],
    [ROUTES.TEAMS]: [USER_ROLES.ADMIN, USER_ROLES.TEAM],
  };
  
  // Local Storage Keys
  export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
  };
  
  // API Endpoints
  export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    
    // Videos
    VIDEOS: '/videos',
    VIDEOS_PUBLISHED: '/videos/published',
    VIDEOS_BY_CREATOR: (creatorId) => `/videos/creator/${creatorId}`,
    VIDEO_BY_ID: (id) => `/videos/${id}`,
    VIDEO_UPLOAD: '/videos/upload',
    VIDEO_PUBLISH: (videoId) => `/videos/${videoId}/publish`,
    
    // Feedback
    FEEDBACK: '/feedback',
    FEEDBACK_BY_VIDEO: (videoId) => `/feedback/video/${videoId}`,
    FEEDBACK_UPDATE_STATUS: (feedbackId) => `/feedback/${feedbackId}/status`,
    
    // Teams
    TEAMS: '/teams',
    TEAM_BY_ID: (id) => `/teams/${id}`,
    TEAM_MEMBERS: (teamId) => `/teams/${teamId}/members`,
    TEAM_ADD_MEMBER: (teamId, userId) => `/teams/${teamId}/members/${userId}`,
  };
  
  // Status Colors for UI
  export const STATUS_COLORS = {
    [FEEDBACK_STATUS.PENDING]: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-300',
      border: 'border-yellow-500/30',
    },
    [FEEDBACK_STATUS.IN_PROGRESS]: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-300',
      border: 'border-blue-500/30',
    },
    [FEEDBACK_STATUS.RESOLVED]: {
      bg: 'bg-green-500/20',
      text: 'text-green-300',
      border: 'border-green-500/30',
    },
    [FEEDBACK_STATUS.REJECTED]: {
      bg: 'bg-red-500/20',
      text: 'text-red-300',
      border: 'border-red-500/30',
    },
  };
  
  // Stat Card Colors
  export const STAT_CARD_COLORS = {
    purple: 'from-purple-600 to-purple-800',
    green: 'from-green-600 to-green-800',
    blue: 'from-blue-600 to-blue-800',
    red: 'from-red-600 to-red-800',
    orange: 'from-orange-600 to-orange-800',
  };
  
  // Form Validation Rules
  export const VALIDATION_RULES = {
    EMAIL: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
    PASSWORD: {
      minLength: 6,
      message: 'Password must be at least 6 characters long',
    },
    VIDEO_URL: {
      pattern: /^https?:\/\/.+/,
      message: 'Please enter a valid URL starting with http:// or https://',
    },
  };
  
  // Pagination
  export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  };
  
  // Toast/Notification Messages
  export const MESSAGES = {
    // Success
    LOGIN_SUCCESS: 'Login successful!',
    REGISTER_SUCCESS: 'Registration successful!',
    VIDEO_UPLOAD_SUCCESS: 'Video uploaded successfully!',
    VIDEO_PUBLISH_SUCCESS: 'Video published successfully!',
    FEEDBACK_SUBMIT_SUCCESS: 'Feedback submitted successfully!',
    TEAM_CREATE_SUCCESS: 'Team created successfully!',
    
    // Error
    LOGIN_ERROR: 'Login failed. Please check your credentials.',
    REGISTER_ERROR: 'Registration failed. Please try again.',
    VIDEO_UPLOAD_ERROR: 'Failed to upload video.',
    FEEDBACK_SUBMIT_ERROR: 'Failed to submit feedback.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    
    // Info
    LOADING: 'Loading...',
    NO_DATA: 'No data available',
  };
  
  // Date/Time Formats
  export const DATE_FORMATS = {
    FULL: 'MMMM DD, YYYY hh:mm A',
    SHORT: 'MMM DD, YYYY',
    TIME_ONLY: 'hh:mm A',
  };
  
  // Video Duration Limits (in seconds)
  export const VIDEO_LIMITS = {
    MIN_DURATION: 1,
    MAX_DURATION: 7200, // 2 hours
    MAX_FILE_SIZE: 500 * 1024 * 1024, // 500MB
  };
  
  // Animation/Transition Durations (in ms)
  export const ANIMATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  };
  
  export default {
    API_CONFIG,
    USER_ROLES,
    FEEDBACK_STATUS,
    ROUTES,
    ROUTE_PERMISSIONS,
    STORAGE_KEYS,
    API_ENDPOINTS,
    STATUS_COLORS,
    STAT_CARD_COLORS,
    VALIDATION_RULES,
    PAGINATION,
    MESSAGES,
    DATE_FORMATS,
    VIDEO_LIMITS,
    ANIMATION,
  };
  