import React, { useState } from 'react';
import { X, Key, Unlock } from 'lucide-react';

export default function RedeemCodeModal({ onClose, onRedeem }) {
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      alert('Please enter an access code');
      return;
    }

    setSubmitting(true);
    try {
      await onRedeem(code.trim().toUpperCase());
    } catch (err) {
      console.error('Failed to redeem code', err);
      alert('Invalid access code or access code redemption failed');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCode = (value) => {
    // Auto-format as user types: ABCD-EFGH
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length <= 4) return cleaned;
    return cleaned.slice(0, 4) + '-' + cleaned.slice(4, 8);
  };

  const handleCodeChange = (e) => {
    const formatted = formatCode(e.target.value);
    setCode(formatted);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Unlock className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Enter Access Code</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-gray-300 mb-4">
              Enter the access code provided by the creator to unlock this video
            </p>
          </div>

          {/* Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Access Code
            </label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="ABCD-EFGH"
              maxLength={9}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-center text-2xl font-mono tracking-wider placeholder-gray-500 focus:outline-none focus:border-green-500 uppercase"
              required
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Format: 4 characters - 4 characters
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Key className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-300 font-medium mb-1">Need an access code?</p>
                <p className="text-xs text-gray-400">
                  Contact the video creator to get an access code. Once entered, you'll have instant access to the video.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || code.length < 8}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
            >
              <Unlock className="w-4 h-4" />
              <span>{submitting ? 'Unlocking...' : 'Unlock Video'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
