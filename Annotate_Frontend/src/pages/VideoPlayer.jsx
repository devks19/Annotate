// src/pages/VideoPlayer.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import FeedbackItem from '../components/ui/FeedbackItem';
import RedeemCodeModal from '../components/ui/RedeemCodeModal';
import useAuth from '../hooks/useAuth';
import {
  ArrowLeft,
  Clock,
  Trash2,
  Lock,
  CheckCircle,
  XCircle,
  Key,
  Copy,
} from 'lucide-react';

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const videoRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ comment: '', timestamp: 0 });
  const [currentTime, setCurrentTime] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // access control
  const [hasAccess, setHasAccess] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [accessRequest, setAccessRequest] = useState(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const numericId = Number(id);

  // ---------- Data loading ----------

  const checkVideoAccess = useCallback(async () => {
    try {
      const resp = await api.videoAccess.checkAccess(id);
      const allowed = !!resp?.hasAccess;
      setHasAccess(allowed);

      if (!allowed) {
        const myRequests = await api.videoAccess.getMyRequests();
        const existing = myRequests.find((r) => r.videoId === numericId);
        setAccessRequest(existing || null);
      }
    } catch (err) {
      console.error('Failed to check access', err);
      setHasAccess(false);
    } finally {
      setAccessChecked(true);
    }
  }, [id, numericId]);

  const loadVideo = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.videos.getById(id);
      setVideo(data);
      await checkVideoAccess();
    } catch (err) {
      console.error('Failed to load video', err);
    } finally {
      setLoading(false);
    }
  }, [id, checkVideoAccess]);

  const loadFeedbacks = useCallback(async () => {
    if (!hasAccess) return;
    try {
      const data = await api.feedback.getByVideo(id);
      setFeedbacks(data);
    } catch (err) {
      console.error('Failed to load feedbacks', err);
    }
  }, [id, hasAccess]);

  useEffect(() => {
    loadVideo();
  }, [loadVideo]);

  useEffect(() => {
    if (accessChecked && hasAccess) {
      loadFeedbacks();
    }
  }, [accessChecked, hasAccess, loadFeedbacks]);

  // ---------- Handlers ----------

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!newFeedback.comment.trim() || !hasAccess) return;

    try {
      setSubmitting(true);
      await api.feedback.create({
        videoId: numericId,
        comment: newFeedback.comment,
        timestampSeconds: Math.floor(currentTime),
      });
      setNewFeedback({ comment: '', timestamp: 0 });
      await loadFeedbacks();
    } catch (err) {
      console.error('Failed to submit feedback', err);
      alert('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVideo = async () => {
    const confirmDelete = window.confirm(
      `⚠️ Are you sure you want to delete "${video.title}"?\n\nThis will permanently delete:\n• The video file\n• All feedback\n\nThis action CANNOT be undone.`
    );
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await api.videos.delete(id);
      alert('✅ Video deleted successfully!');
      navigate('/videos');
    } catch (err) {
      console.error('Failed to delete video', err);
      alert('❌ Failed to delete video: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleApproveFeedback = async (feedbackId) => {
    try {
      await api.feedback.approve(feedbackId);
      await loadFeedbacks();
    } catch (err) {
      console.error('Failed to approve feedback', err);
      alert('Failed to approve feedback: ' + err.message);
    }
  };

  const handleRejectFeedback = async (feedbackId) => {
    try {
      await api.feedback.reject(feedbackId);
      await loadFeedbacks();
    } catch (err) {
      console.error('Failed to reject feedback', err);
      alert('Failed to reject feedback: ' + err.message);
    }
  };

  const handleRedeemCode = async (code) => {
    try {
      await api.videoAccessCode.redeemCode(code);
      alert('✅ Access granted! Reloading video...');
      setShowRedeemModal(false);
      window.location.reload();
    } catch (err) {
      console.error('Failed to redeem code', err);
      throw err;
    }
  };

  // ---------- Derived flags ----------

  const canDelete =
    user &&
    (user.userId === video?.creator?.id || user.role === 'ADMIN');

  const isCreator = user && user.userId === video?.creator?.id;

  // ---------- Loading / not found ----------

  if (loading || !accessChecked) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-200 text-sm shadow-lg">
          Loading video…
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-4 text-red-200">
        Video not found.
      </div>
    );
  }

  // ---------- Access denied UI ----------

  if (!hasAccess && !isCreator) {
    return (
      <div className="space-y-6 animate-[fadeIn_200ms_ease-out]">
        {/* Back */}
        <button
          onClick={() => navigate('/videos')}
          className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to videos</span>
        </button>

        {/* Locked card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.95)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.2),_transparent_60%)]" />

          <div className="relative max-w-xl mx-auto px-8 py-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/15 border border-yellow-400/40 shadow-[0_0_0_1px_rgba(248,250,252,0.04)]">
              <Lock className="w-10 h-10 text-yellow-300" />
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">
              {video.title}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              by {video.creator?.name}
            </p>

            <p className="mt-4 text-slate-300 text-sm">
              Video's permission removed. You’ll need access from the creator to
              watch it.
            </p>

            {/* Request status / code entry */}
            <div className="mt-6">
              {accessRequest ? (
                <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 px-5 py-4 text-left">
                  <div className="flex items-center gap-2 mb-2 justify-between">
                    <div className="flex items-center gap-2">
                      {accessRequest.status === 'PENDING' && (
                        <>
                          <Clock className="w-4 h-4 text-yellow-300" />
                          <span className="text-xs font-medium text-yellow-200 uppercase tracking-wide">
                            Request Pending
                          </span>
                        </>
                      )}

                      {accessRequest.status === 'APPROVED' && (
                        <>
                          {/* <CheckCircle className="w-4 h-4 text-emerald-300" /> */}
                          <span className="text-xs font-medium text-red-200 uppercase tracking-wide">
                            Request Denied
                          </span>
                        </>
                      )}

                      {accessRequest.status === 'DENIED' && (
                        <>
                          <XCircle className="w-4 h-4 text-red-300" />
                          <span className="text-xs font-medium text-red-200 uppercase tracking-wide">
                            Request Denied
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">
                    Requested on{' '}
                    {new Date(
                      accessRequest.requestedAt
                    ).toLocaleDateString()}
                  </p>

                  {accessRequest.responseMessage && (
                    <p className="mt-2 text-sm text-slate-200 italic">
                      “{accessRequest.responseMessage}”
                    </p>
                  )}

                  <p className="mt-3 text-xs font-medium text-red-300">
                    Contact the creator if you need access again!
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowRedeemModal(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <Key className="w-4 h-4" />
                  <span>Enter access code</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {showRedeemModal && (
          <RedeemCodeModal
            onClose={() => setShowRedeemModal(false)}
            onRedeem={handleRedeemCode}
          />
        )}
      </div>
    );
  }

  // ---------- Full player UI (has access or creator) ----------

  return (
    <div className="space-y-6 animate-[fadeIn_200ms_ease-out]">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate('/videos')}
          className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to videos</span>
        </button>

        {canDelete && (
          <button
            onClick={handleDeleteVideo}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-full bg-red-600/90 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-red-500/30 hover:bg-red-500 disabled:opacity-60 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleting ? 'Deleting…' : 'Delete video'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Player + feedback form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video card */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.95)]">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.22),_transparent_55%)]" />

            <video
              ref={videoRef}
              src={video.videoUrl}
              className="relative w-full aspect-video bg-black"
              controls
              onTimeUpdate={handleTimeUpdate}
              preload="metadata"
            >
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="relative p-6 border-t border-slate-800/80 bg-slate-950/90">
              <h2 className="text-2xl font-semibold text-slate-50">
                {video.title}
              </h2>

              {/* Access code / manage viewer access (creator only) */}
              {isCreator && video.accessCode && (
                <div className="mt-4 rounded-2xl border border-violet-500/40 bg-violet-900/20 px-4 py-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
                        <Key className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-300">Access code</p>
                        <code className="text-lg font-mono font-semibold tracking-widest text-violet-200">
                          {video.accessCode}
                        </code>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(video.accessCode);
                          // alert('✅ Access code copied!');
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>

                      <button
                        onClick={() => navigate(`/videos/${id}/access`)}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1.5 text-xs font-medium text-white shadow-md shadow-violet-500/30 hover:shadow-violet-500/40 transition-all"
                      >
                        Manage viewer access
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Share this code with viewers. You can temporarily suspend or
                    permanently revoke access from the access manager.
                  </p>
                </div>
              )}

              <p className="mt-3 text-sm text-slate-300">
                {video.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span>
                  Creator:{' '}
                  <span className="text-slate-200">
                    {video.creator?.name || 'Unknown'}
                  </span>
                </span>
                <span className="opacity-40">•</span>
                <span>Duration: {video.durationSeconds}s</span>
                <span className="opacity-40">•</span>
                <span
                  className={
                    video.isPublished ? 'text-emerald-300' : 'text-yellow-300'
                  }
                >
                  {video.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback form */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 px-6 py-5 shadow-[0_14px_35px_rgba(15,23,42,0.85)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-50">
                Add feedback
              </h3>
              <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span>Current time: {Math.floor(currentTime)}s</span>
              </div>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-3">
              <textarea
                value={newFeedback.comment}
                onChange={(e) =>
                  setNewFeedback({ ...newFeedback, comment: e.target.value })
                }
                placeholder="What should be improved here? Be specific and helpful."
                className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/70 resize-none min-h-[96px]"
                required
              />
              <div className="flex justify-start">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60"
                >
                  {submitting ? 'Submitting…' : 'Submit feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Feedback list */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/95 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.95)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-50">
              Feedback ({feedbacks.length})
            </h3>
            <span className="text-[11px] text-slate-500">
              {isCreator
                ? 'Approve or reject viewer comments'
                : 'Your feedback and others’ comments'}
            </span>
          </div>

          {feedbacks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-slate-500">
              <p>No feedback yet.</p>
              <p className="mt-1 text-xs">
                Be the first to leave a helpful comment.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {feedbacks.map((fb) => (
                <FeedbackItem
                  key={fb.id}
                  feedback={fb}
                  isCreator={isCreator}
                  onApprove={handleApproveFeedback}
                  onReject={handleRejectFeedback}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showRedeemModal && (
        <RedeemCodeModal
          onClose={() => setShowRedeemModal(false)}
          onRedeem={handleRedeemCode}
        />
      )}
    </div>
  );
}
