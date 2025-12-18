import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Unlock, Video, ArrowRight, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function UnlockVideoPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const formatCode = (value) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length <= 4) return cleaned;
    return cleaned.slice(0, 4) + '-' + cleaned.slice(4, 8);
  };

  const handleCodeChange = (e) => {
    setError('');
    const formatted = formatCode(e.target.value);
    setCode(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.length < 8) {
      setError('Please enter a valid access code');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.videoAccessCode.redeemCode(code.trim());
      
      // Success! Show success message and redirect
      alert('✅ Video unlocked successfully!\n\nYou can now access this video from your Videos page.');
      navigate('/videos');
    } catch (err) {
      console.error('Failed to redeem code', err);
      setError('Invalid access code. Please check and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Unlock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Unlock a Video</h1>
          <p className="text-gray-400">
            Enter the access code provided by the creator to unlock and view their video
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-6">
          {/* Access Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Access Code
            </label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="ABCD-EFGH"
              maxLength={9}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-center text-3xl font-mono tracking-widest placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 uppercase transition-all"
              required
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Format: 4 characters - 4 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || code.length < 8}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Unlocking...</span>
              </>
            ) : (
              <>
                <Unlock className="w-5 h-5" />
                <span>Unlock Video</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Key className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-300 font-medium mb-1">How to get an access code?</p>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Contact the video creator</li>
                  <li>• They will share a unique code with you</li>
                  <li>• Enter the code here to unlock instant access</li>
                </ul>
              </div>
            </div>
          </div>
        </form>

        {/* Success Features */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>After unlocking:</span>
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center space-x-2">
              <Video className="w-4 h-4 text-purple-400" />
              <span>Video appears in your Videos page</span>
            </li>
            <li className="flex items-center space-x-2">
              <Video className="w-4 h-4 text-purple-400" />
              <span>Watch anytime without re-entering code</span>
            </li>
            <li className="flex items-center space-x-2">
              <Video className="w-4 h-4 text-purple-400" />
              <span>Access to all video features & annotations</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
