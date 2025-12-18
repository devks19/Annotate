// src/pages/Dashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Check,
  MessageSquare,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import StatCard from '../components/ui/StatCard';
import useAuth from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    feedbacks: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      // VIEWER → redirect to creators page
      if (user.role === 'VIEWER') {
        navigate('/creators');
        return;
      }

      let myVideos = [];

      if (user.role === 'CREATOR') {
        myVideos = await api.videos.getByCreator(user.userId);
      } else if (user.role === 'ADMIN') {
        // Admin sees all videos
        if (api.videos.getAll) {
          myVideos = await api.videos.getAll();
        } else {
          // fallback if getAll doesn't exist
          myVideos = await api.videos.getPublished();
        }
      } else {
        myVideos = await api.videos.getPublished();
      }

      setStats({
        total: myVideos.length,
        published: myVideos.filter((v) => v.isPublished).length,
        feedbacks: myVideos.reduce(
          (sum, v) => sum + (v.feedbacks?.length || 0),
          0
        ),
      });

      setVideos(myVideos);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) loadDashboard();
  }, [loadDashboard, user]);

  const handleVideoClick = useCallback(
    (videoId) => {
      navigate(`/videos/${videoId}`);
    },
    [navigate]
  );

  const handlePublishToggle = async (videoId, currentStatus) => {
    try {
      if (!currentStatus) {
        await api.videos.publish(videoId);
        await loadDashboard();
      }
    } catch (err) {
      console.error('Failed to publish video', err);
      alert('Failed to publish video');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-sm text-slate-300">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="app-section-title flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-300" />
            <span>Dashboard</span>
          </h1>
          <p className="app-subtitle mt-1">
            Overview of your videos, publishing status, and feedback.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="btn-ghost text-xs self-start"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard title="Total Videos" value={stats.total} icon={Video} color="purple" />
        <StatCard title="Published" value={stats.published} icon={Check} color="green" />
        <StatCard title="Feedbacks" value={stats.feedbacks} icon={MessageSquare} color="blue" />
      </div>

      {/* Videos list */}
      <div className="app-card p-5 md:p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-base md:text-lg font-semibold text-slate-50">
            {user.role === 'ADMIN' ? 'All videos' : 'Recent videos'}
          </h2>
          <p className="text-[11px] text-slate-500">
            Click a card to open the video and manage feedback & access.
          </p>
        </div>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-sm text-slate-400">
            <p>No videos found.</p>
            <p className="text-xs text-slate-500 mt-1">
              Upload a new video to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.slice(0, 6).map((video) => (
              <div
                key={video.id}
                className="app-card-soft app-card-hover overflow-hidden cursor-pointer flex flex-col"
              >
                {/* Thumbnail */}
                <div
                  className="relative aspect-video flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950"
                  onClick={() => handleVideoClick(video.id)}
                >
                  <Video className="w-10 h-10 text-slate-400 group-hover:text-slate-200 transition-colors" />
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col">
                  <div>
                    <h3 className="font-medium text-slate-50 text-sm truncate">
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {video.creator?.name || 'Unknown'}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    {video.isPublished ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[11px] font-medium">
                        <Eye className="w-3 h-3" />
                        <span>Published</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 px-2 py-0.5 text-[11px] font-medium">
                        <EyeOff className="w-3 h-3" />
                        <span>Draft</span>
                      </span>
                    )}

                    {(user.role === 'CREATOR' || user.role === 'ADMIN') &&
                      !video.isPublished && (
                        <button
                          onClick={() =>
                            handlePublishToggle(video.id, video.isPublished)
                          }
                          className="btn-primary text-[11px] px-3 py-1"
                        >
                          Publish
                        </button>
                      )}
                  </div>

                  {video.feedbacks && video.feedbacks.length > 0 && (
                    <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{video.feedbacks.length} feedbacks</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
