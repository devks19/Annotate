import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Video, Upload, Users, LogOut, User, Key } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
// import { useAuth } from '../../context/AuthContext';

const MENU_ITEMS = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: Video, roles: ['ADMIN', 'CREATOR', 'TEAM', 'VIEWER'] },
  { id: 'videos', path: '/videos', label: 'Videos', icon: Camera, roles: ['ADMIN', 'CREATOR', 'TEAM', 'VIEWER'] },
  { id: 'upload', path: '/upload', label: 'Upload', icon: Upload, roles: ['CREATOR', 'ADMIN'] },
  { id: 'unlock', path: '/unlock', label: 'Unlock Video', icon: Key, roles: ['VIEWER'] },

  { id: 'teams', path: '/teams', label: 'Teams', icon: Users, roles: ['ADMIN', 'TEAM'] },
];

export default function Navbar() {

  

  const { user, logout } = useAuth();
  const location = useLocation();

  const filteredItems = useMemo(
    () => MENU_ITEMS.filter((item) => item.roles.includes(user?.role)),
    [user?.role]
  );

  // console.log('🔴 NAVBAR RENDERED');

  return (
    <nav className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Camera className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">Annotate</span>
            </Link>

            <div className="flex space-x-1">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}


            </div>
            
          </div>
          

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-lg">
              <User className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
            </div>
            {/* {user.role === 'CREATOR' && (
  <Link
    to="/access-requests"
    className="text-gray-300 hover:text-white transition-colors"
  >
    Access Requests
  </Link>
)} */}
            <button
              onClick={logout}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
