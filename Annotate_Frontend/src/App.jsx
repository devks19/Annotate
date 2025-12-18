import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import useAuth from './hooks/useAuth';
import CreatorsPage from './pages/CreatorsPage';
import CreatorProfilePage from './pages/CreatorProfilePage';
import AccessRequestsPage from './pages/AccessRequestsPage';
import UnlockVideoPage from './pages/UnlockVideoPage';
import VideoAccessPage from './pages/VideoAccessPage';
// import AccessManager from './pages/AccessManager';


// Lazy load pages
const AuthScreen = lazy(() => import('./pages/AuthScreen'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const VideosView = lazy(() => import('./pages/VideosView'));
const VideoPlayer = lazy(() => import('./pages/VideoPlayer'));
const UploadView = lazy(() => import('./pages/UploadView'));
const TeamsView = lazy(() => import('./pages/TeamsView'));

export default function App() {
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={!user ? <AuthScreen /> : <Navigate to="/dashboard" replace />}
          />

          {/* Protected Routes
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/videos" element={<VideosView />} />
            <Route path="/videos/:id" element={<VideoPlayer />} />
            
            
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute allowedRoles={['CREATOR', 'ADMIN']}>
                  <UploadView />
                </ProtectedRoute>
              } 
            />
            
            
            <Route 
              path="/teams" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TEAM']}>
                  <TeamsView />
                </ProtectedRoute>
              } 
            />
          </Route> */}

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}> {/* ← LAYOUT HERE */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/videos" element={<VideosView />} />
              <Route path="/videos/:id" element={<VideoPlayer />} />
              <Route
  path="/videos/:id/access"
  element={
    <ProtectedRoute allowedRoles={['CREATOR']}>
      <VideoAccessPage />
    </ProtectedRoute>
  }
/>

              <Route path="/unlock" element={<UnlockVideoPage />} />
              <Route path="/access-requests" element={<AccessRequestsPage />} />

              {/* Creator Discovery and Profile Routes */}
              <Route path="/creators" element={<CreatorsPage />} />
              <Route path="/creators/:id" element={<CreatorProfilePage />} />

              <Route
                path="/upload"
                element={
                  <ProtectedRoute allowedRoles={['CREATOR', 'ADMIN']}>
                    <UploadView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/teams"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'TEAM']}>
                    <TeamsView />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>

          

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

          





        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
