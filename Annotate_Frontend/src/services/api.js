const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
    console.log('With token:', token ? 'Present' : 'Missing');



    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      // ✅ FIX: Handle empty responses (DELETE, PUT with no content)
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      // Return null for empty responses
      if (response.status === 204 || contentLength === '0' || !contentType) {
        return null;
      }
      
      // Only parse JSON if content-type is JSON
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }

    
  }

  // Auth endpoints
  auth = {
    login: (email, password) =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (data) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  // Video endpoints
  videos = {
    getPublished: () => this.request('/videos/published'),
    getByCreator: (creatorId) => this.request(`/videos/creator/${creatorId}`),
    getById: (id) => this.request(`/videos/${id}`),
    upload: (data) =>
      this.request('/videos/upload', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    publish: (videoId) =>
      this.request(`/videos/${videoId}/publish`, {
        method: 'PUT',
      }),
    delete: (videoId) =>
      this.request(`/videos/${videoId}`, {
        method: 'DELETE',
      }),
      getAccessibleVideos: () => this.request('/videos/accessible'),
  };

  // Feedback endpoints
  feedback = {
    create: (data) =>
      this.request('/feedback', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getByVideo: (videoId) => this.request(`/feedback/video/${videoId}`),
    updateStatus: (feedbackId, status) =>
      this.request(`/feedback/${feedbackId}/status?status=${status}`, {
        method: 'PUT',
      }),

      approve: (feedbackId) =>
      this.request(`/feedback/${feedbackId}/approve`, {
        method: 'PUT',
      }),
    reject: (feedbackId) =>
      this.request(`/feedback/${feedbackId}/reject`, {
        method: 'PUT',
      }),

  };

  // Team endpoints
  teams = {
    getAll: () => this.request('/teams'),
    create: (data) =>
      this.request('/teams', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getMembers: (teamId) => this.request(`/teams/${teamId}/members`),
  };

  // User endpoints
users = {
  getCreators: () => this.request('/users/creators'),
  getCreatorById: (id) => this.request(`/users/creators/${id}`),
  getCurrentProfile: () => this.request('/users/profile'),
  getAccessibleCreators: () => this.request('/users/accessible-creators'),
};

// Video Access endpoints;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
// videoAccess = {
//   requestAccess: (data) =>
//     this.request('/video-access/request', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     }),
  
//   checkAccess: (videoId) =>
//     this.request(`/video-access/check/${videoId}`),
  
//   getPendingRequests: () =>
//     this.request('/video-access/pending'),
  
//   getMyRequests: () =>
//     this.request('/video-access/my-requests'),

//     getApprovedAccess: () =>
//     this.request('/video-access/approved'),
  
//   revokeAccess: (requestId) =>
//     this.request(`/video-access/${requestId}/revoke`, {
//       method: 'DELETE',
//     }),
  
//   approveRequest: (requestId, message) =>
//     this.request(`/video-access/${requestId}/approve`, {
//       method: 'PUT',
//       body: JSON.stringify({ message }),
//     }),
  
//   denyRequest: (requestId, message) =>
//     this.request(`/video-access/${requestId}/deny`, {
//       method: 'PUT',
//       body: JSON.stringify({ message }),
//     }),
// };

videoAccessCode = {
  generateCode: (videoId) =>
    this.request(`/video-access-code/generate/${videoId}`, {
      method: 'POST',
    }),
  
  getCode: (videoId) =>
    this.request(`/video-access-code/${videoId}`),
  
  redeemCode: (code) =>
    this.request('/video-access-code/redeem', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
  
  disableCode: (videoId) =>
    this.request(`/video-access-code/${videoId}`, {
      method: 'DELETE',
    }),
};

// Video Access endpoints
videoAccess = {
  requestAccess: (data) =>
    this.request('/video-access/request', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  checkAccess: (videoId) =>
    this.request(`/video-access/check/${videoId}`),

  getPendingRequests: () =>
    this.request('/video-access/pending'),

  getMyRequests: () =>
    this.request('/video-access/my-requests'),

  getApprovedAccess: () =>
    this.request('/video-access/approved'),

  revokeAccess: (requestId) =>
    this.request(`/video-access/${requestId}/revoke`, {
      method: 'DELETE',
    }),

  approveRequest: (requestId, message) =>
    this.request(`/video-access/${requestId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ message }),
    }),

  denyRequest: (requestId, message) =>
    this.request(`/video-access/${requestId}/deny`, {
      method: 'PUT',
      body: JSON.stringify({ message }),
    }),

  // ⭐ NEW FOR ACCESS VIEWER PAGE ⭐
  getAccessForVideo: (videoId) =>
    this.request(`/video-access/video/${videoId}`),

  suspendAccess: (permissionId, suspendedUntil) =>
    this.request(`/video-access/${permissionId}/suspend`, {
      method: 'PUT',
      body: JSON.stringify({ suspendedUntil }),
    }),

  revokeAccessPermanent: (permissionId, message) =>
    this.request(`/video-access/${permissionId}/revoke-permanent`, {
      method: 'PUT',
      body: JSON.stringify({ message }),
    }),

  restoreAccess: (permissionId) =>
    this.request(`/video-access/${permissionId}/restore`, {
      method: 'PUT',
    }),
};

// videoAccessCode = {
//   generateCode: (videoId) =>
//     this.request(`/video-access-code/generate/${videoId}`, {
//       method: 'POST',
//     }),

//   getCode: (videoId) =>
//     this.request(`/video-access-code/${videoId}`),

//   redeemCode: (code) =>
//     this.request('/video-access-code/redeem', {
//       method: 'POST',
//       body: JSON.stringify({ code }),
//     }),

//   disableCode: (videoId) =>
//     this.request(`/video-access-code/${videoId}`, {
//       method: 'DELETE',
//     }),
// };




}

export const api = new ApiService();


// src/services/api.js

