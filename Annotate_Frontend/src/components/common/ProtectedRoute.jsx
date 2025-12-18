import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import Navbar from '../layout/Navbar';
import useAuth from '../../hooks/useAuth';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
  //     <Navbar />
  //     <main className="container mx-auto px-4 py-8">
  //       {children || <Outlet />}
  //     </main>
  //   </div>
  // );
  // Just render children - NO NAVBAR
  return children || <Outlet />;
}
