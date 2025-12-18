import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import VideoCard from '../components/ui/VideoCard';
import useAuth from '../hooks/useAuth';
import { Key, Video as VideoIcon } from 'lucide-react'; // ✅ Add icons

export default function VideosView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadVideos = useCallback(async () => {
    try {
      setLoading(true);
      let data;

      if (user.role === 'CREATOR') {
        // ✅ Creators see their own videos
        data = await api.videos.getByCreator(user.userId);
      } else if (user.role === 'VIEWER') {
        // ✅ Viewers see only videos they have access to
        data = await api.videos.getAccessibleVideos();
      } else {
        // ✅ Admins see all published videos
        data = await api.videos.getPublished();
      }

      setVideos(data);
    } catch (err) {
      console.error('Failed to load videos', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const handleVideoClick = useCallback(
    (videoId) => {
      navigate(`/videos/${videoId}`);
    },
    [navigate]
  );

  const handleVideoDelete = useCallback(
    (videoId) => {
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
    },
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300">
        Error loading videos: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          {user.role === 'CREATOR' ? 'My Videos' : 'My Unlocked Videos'}
        </h1>
        <p className="text-gray-400">{videos.length} videos found</p>
      </div>

      {videos.length === 0 ? (
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
          {user.role === 'VIEWER' ? (
            // ✅ Empty state for viewers
            <div>
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-gray-300 text-xl font-semibold mb-2">No Unlocked Videos Yet</p>
              <p className="text-gray-500 mb-6">
                Enter an access code to unlock videos from creators
              </p>
              <button
                onClick={() => navigate('/unlock')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <Key className="w-5 h-5" />
                <span>Unlock a Video</span>
              </button>
            </div>
          ) : (
            // ✅ Empty state for creators
            <div>
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <VideoIcon className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-gray-400 text-lg">No videos uploaded yet</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} onClick={() => handleVideoClick(video.id)}>
              <VideoCard 
                video={video} 
                user={user}
                onDelete={handleVideoDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
