// src/services/videoAccessService.js
// uses your existing axios instance from services/api.js

import api from "./api";

// VIEWER SIDE
export const requestAccess = (data) =>
  api.post("/video-access/request", data);

export const checkAccess = (videoId) =>
  api.get(`/video-access/check/${videoId}`);

export const getMyRequests = () =>
  api.get("/video-access/my-requests");

// CREATOR SIDE
export const getPendingRequests = () =>
  api.get("/video-access/pending");

export const approveAccess = (requestId, message) =>
  api.put(`/video-access/${requestId}/approve`, { message });

export const denyAccess = (requestId, message) =>
  api.put(`/video-access/${requestId}/deny`, { message });

export const getApprovedAccess = () =>
  api.get("/video-access/approved");

// 🔥 NEW: Access viewer + temp / permanent removal
export const getAccessForVideo = (videoId) =>
  api.get(`/video-access/video/${videoId}`);

export const suspendAccess = (permissionId, suspendedUntil) =>
  api.put(`/video-access/${permissionId}/suspend`, { suspendedUntil });

export const revokeAccessPermanent = (permissionId, message) =>
  api.put(`/video-access/${permissionId}/revoke-permanent`, { message });

export const restoreAccess = (permissionId) =>
  api.put(`/video-access/${permissionId}/restore`);
