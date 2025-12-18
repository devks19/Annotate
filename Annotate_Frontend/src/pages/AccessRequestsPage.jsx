import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle, User, Video, MessageSquare } from 'lucide-react';
import { api } from '../services/api';
import useAuth from '../hooks/useAuth';

export default function AccessRequestsPage() {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'my-requests'
  const [approvedAccess, setApprovedAccess] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      
      if (user.role === 'CREATOR') {
        const pending = await api.videoAccess.getPendingRequests();
        setPendingRequests(pending);
      }
      
      const myReqs = await api.videoAccess.getMyRequests();
      setMyRequests(myReqs);
    } catch (err) {
      console.error('Failed to load requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    const message = prompt('Add a message (optional):');
    
    try {
      await api.videoAccess.approveRequest(requestId, message);
      alert('Access request approved!');
      loadRequests();
    } catch (err) {
      console.error('Failed to approve request', err);
      alert('Failed to approve request');
    }
  };

  const handleDeny = async (requestId) => {
    const message = prompt('Reason for denial (optional):');
    
    try {
      await api.videoAccess.denyRequest(requestId, message);
      alert('Access request denied');
      loadRequests();
    } catch (err) {
      console.error('Failed to deny request', err);
      alert('Failed to deny request');
    }
  };

  const handleRevoke = async (requestId, viewerName, videoTitle) => {
    const confirmRevoke = window.confirm(
      `⚠️ Revoke access for "${viewerName}" from "${videoTitle}"?\n\nThey will no longer be able to view this video.`
    );
    
    if (!confirmRevoke) return;
    
    try {
      await api.videoAccess.revokeAccess(requestId);
      alert('Access revoked successfully');
      loadRequests();
    } catch (err) {
      console.error('Failed to revoke access', err);
      alert('Failed to revoke access');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Access Requests</h1>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-white/10">
        {user.role === 'CREATOR' && (
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'pending'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Pending Requests ({pendingRequests.length})
          </button>
          

          
        )}
        <button
          onClick={() => setActiveTab('my-requests')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'my-requests'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          My Requests ({myRequests.length})
        </button>

        <button
            onClick={() => setActiveTab('approved')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'approved'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Approved ({approvedAccess.length})
          </button>
          <button
            onClick={() => setActiveTab('my-requests')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'my-requests'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            My Requests ({myRequests.length})
          </button>
      </div>

      {/* Pending Requests (For Creators) */}
      {activeTab === 'pending' && user.role === 'CREATOR' && (
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">
            Pending Access Requests
          </h2>

          {pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-purple-400" />
                        <span className="font-medium text-white">
                          {request.viewerName}
                        </span>
                        <span className="text-gray-500 text-sm">
                          wants access to
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Video className="w-4 h-4 text-pink-400" />
                        <span className="text-gray-300">{request.videoTitle}</span>
                      </div>
                      {request.requestReason && (
                        <div className="flex items-start space-x-2 mt-3">
                          <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-400">
                            "{request.requestReason}"
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Requested {new Date(request.requestedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleDeny(request.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Deny</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

{activeTab === 'approved' && user.role === 'CREATOR' && (
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>Approved Access</span>
          </h2>

          {approvedAccess.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-gray-400 text-lg">No approved access yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Viewers with approved access will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {approvedAccess.map((access) => (
                <div
                  key={access.id}
                  className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-green-500/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Viewer Info */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{access.viewerName}</p>
                          <p className="text-sm text-green-400">Has access</p>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="flex items-center space-x-2 mb-3 pl-13">
                        <Video className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-medium">{access.videoTitle}</span>
                      </div>

                      {/* Response Message */}
                      {access.responseMessage && (
                        <div className="bg-black/30 rounded-lg p-3 mb-3">
                          <div className="flex items-start space-x-2">
                            <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-300">
                              Your message: "{access.responseMessage}"
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Timestamps */}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Approved: {new Date(access.respondedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Revoke Button */}
                    <button
                      onClick={() => handleRevoke(access.id, access.viewerName, access.videoTitle)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Revoke</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Requests */}
      {activeTab === 'my-requests' && (
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">My Access Requests</h2>

          {myRequests.length === 0 ? (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No access requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Video className="w-4 h-4 text-purple-400" />
                        <span className="font-medium text-white">
                          {request.videoTitle}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        {request.status === 'PENDING' && (
                          <>
                            <Clock className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-yellow-400">Pending</span>
                          </>
                        )}
                        {request.status === 'APPROVED' && (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-green-400">Approved</span>
                          </>
                        )}
                        {request.status === 'DENIED' && (
                          <>
                            <XCircle className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-red-400">Denied</span>
                          </>
                        )}
                      </div>

                      {request.requestReason && (
                        <p className="text-sm text-gray-400 mb-2">
                          Your message: "{request.requestReason}"
                        </p>
                      )}

                      {request.responseMessage && (
                        <p className="text-sm text-gray-300 bg-white/5 p-2 rounded">
                          Response: "{request.responseMessage}"
                        </p>
                      )}

                      <p className="text-xs text-gray-500 mt-2">
                        Requested {new Date(request.requestedAt).toLocaleString()}
                        {request.respondedAt && (
                          <> • Responded {new Date(request.respondedAt).toLocaleString()}</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
