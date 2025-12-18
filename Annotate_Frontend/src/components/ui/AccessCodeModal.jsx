import React, { useState, useEffect } from 'react';
import { X, Key, Copy, Check, RefreshCw, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

export default function AccessCodeModal({ video, onClose }) {
  const [accessCode, setAccessCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadAccessCode();
  }, []);

  const loadAccessCode = async () => {
    try {
      setLoading(true);
      const response = await api.videoAccessCode.getCode(video.id);
      setAccessCode(response.accessCode);
    } catch (err) {
      console.log('No access code exists yet');
      setAccessCode(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const response = await api.videoAccessCode.generateCode(video.id);
      setAccessCode(response.accessCode);
      alert('✅ Access code generated successfully!');
    } catch (err) {
      console.error('Failed to generate code', err);
      alert('Failed to generate access code');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisable = async () => {
    if (!window.confirm('⚠️ Disable access code?\n\nViewers will no longer be able to use this code to access the video.')) {
      return;
    }

    try {
      await api.videoAccessCode.disableCode(video.id);
      alert('✅ Access code disabled');
      onClose();
    } catch (err) {
      console.error('Failed to disable code', err);
      alert('Failed to disable access code');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Key className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Access Code</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-gray-300 mb-2">
              Video: <span className="font-semibold text-white">"{video.title}"</span>
            </p>
            <p className="text-sm text-gray-400">
              Share this code with viewers to grant instant access
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Loading...</div>
            </div>
          ) : accessCode ? (
            <>
              {/* Access Code Display */}
              <div className="bg-black/40 border border-purple-500/30 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-400 mb-2">Access Code</p>
                <div className="text-4xl font-bold text-purple-400 tracking-wider font-mono">
                  {accessCode}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  title="Regenerate code"
                >
                  <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleDisable}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  title="Disable code"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-300 font-medium mb-2">📋 How to share:</p>
                <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                  <li>Copy the access code above</li>
                  <li>Share it with viewers (email, chat, etc.)</li>
                  <li>Viewers enter the code to unlock access</li>
                  <li>Regenerate anytime to revoke old codes</li>
                </ol>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-400 mb-4">No access code generated yet</p>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate Access Code'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
