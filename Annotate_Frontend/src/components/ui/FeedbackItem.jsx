import React, { memo, useState } from 'react';
import { Check, Clock, User, X } from 'lucide-react';

const FeedbackItem = memo(({ feedback, isCreator, onApprove, onReject }) => {

  const [loading, setLoading] = useState(false);
  const statusColors = {
    PENDING: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    IN_PROGRESS: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    ACCEPTED: 'bg-green-500/20 text-green-300 border-green-500/30',
    REJECTED: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  const statusClass = statusColors[feedback.status] || statusColors.PENDING;

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(feedback.id);
    } catch (error) {
      console.error('Failed to approve feedback', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await onReject(feedback.id);
    } catch (error) {
      console.error('Failed to reject feedback', error);
    } finally {
      setLoading(false);
    }
  };

  // const isCreator = user && video?.creator?.id === user.id;

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">
            {feedback.timestampSeconds}s
          </span>
        </div>
        <span className={`px-3 py-1 text-xs rounded-full border ${statusClass}`}>
          {feedback.status}
        </span>
      </div>

      <p className="text-white text-sm mb-3 leading-relaxed">{feedback.comment}</p>

      <div className="flex items-center space-x-2 text-xs text-gray-400">
        <User className="w-3 h-3" />
        <span>{feedback.viewer?.name || 'Anonymous'}</span>
        {feedback.createdAt && (
          <>
            <span>•</span>
            <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
          </>
        )}
      </div>
      {/*Approval Buttons - Only show for creator when status is PENDING */}
    {isCreator && feedback.status === 'PENDING' && (
          <div className="flex items-center space-x-2" style={{paddingTop: '20px'}}>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600/80 hover:bg-green-600 text-white text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-3 h-3" />
              <span>Approve</span>
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-1 bg-red-600/80 hover:bg-red-600 text-white text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-3 h-3" />
              <span>Reject</span>
            </button>
          </div>
        )}

        {/* TEMPORARY: Always show buttons for debugging
        {feedback.status === 'PENDING' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              <Check className="w-3 h-3" />
              <span>Approve</span>
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-3 h-3" />
              <span>Reject</span>
            </button>
          </div>
        )} */}
    </div>
  );
});

FeedbackItem.displayName = 'FeedbackItem';

export default FeedbackItem;
