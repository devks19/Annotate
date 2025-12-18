import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import AccessViewer from "../components/ui/AccessViewer";
import { ArrowLeft } from "lucide-react";
import useAuth from "../hooks/useAuth";

export default function VideoAccessPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await api.videos.getById(id);
      setVideo(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-white">
        Loading Access Manager…
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-red-300 bg-red-500/20 border border-red-500/30 p-4 rounded-lg">
        Video not found.
      </div>
    );
  }

  const isCreator = user?.userId === video.creator?.id;

  if (!isCreator) {
    return (
      <div className="text-red-300 p-4">
        You are not allowed to view access for this video.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(`/videos/${id}`)}
        className="text-purple-400 hover:text-purple-300 flex items-center space-x-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Video</span>
      </button>

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
        <h1 className="text-2xl font-bold text-white">{video.title}</h1>
        <p className="text-gray-400">Manage viewer access for this video</p>
      </div>

      {/* Actual access management */}
      <AccessViewer videoId={parseInt(id, 10)} />
    </div>
  );
}
