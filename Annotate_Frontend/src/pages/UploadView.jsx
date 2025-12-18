// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Upload, CheckCircle } from 'lucide-react';
// import { api } from '../services/api';

// export default function UploadView() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     videoUrl: '',
//     thumbnailUrl: '',
//     durationSeconds: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: name === 'durationSeconds' ? parseInt(value) || 0 : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       await api.videos.upload(formData);
//       setSuccess(true);
//       setFormData({
//         title: '',
//         description: '',
//         videoUrl: '',
//         thumbnailUrl: '',
//         durationSeconds: 0,
//       });
//       setTimeout(() => {
//         setSuccess(false);
//         navigate('/videos');
//       }, 2000);
//     } catch (err) {
//       console.error('Upload failed', err);
//       setError(err.message || 'Failed to upload video');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="flex items-center space-x-3 mb-6">
//         <Upload className="w-8 h-8 text-purple-400" />
//         <h1 className="text-3xl font-bold text-white">Upload Video</h1>
//       </div>

//       {success && (
//         <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 flex items-center space-x-2">
//           <CheckCircle className="w-5 h-5" />
//           <span>Video uploaded successfully! Redirecting...</span>
//         </div>
//       )}

//       {error && (
//         <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
//           {error}
//         </div>
//       )}

//       <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Title <span className="text-red-400">*</span>
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
//               placeholder="Enter video title"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 min-h-[100px]"
//               placeholder="Enter video description"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Video URL <span className="text-red-400">*</span>
//             </label>
//             <input
//               type="url"
//               name="videoUrl"
//               value={formData.videoUrl}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
//               placeholder="https://example.com/video.mp4"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Thumbnail URL
//             </label>
//             <input
//               type="url"
//               name="thumbnailUrl"
//               value={formData.thumbnailUrl}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
//               placeholder="https://example.com/thumbnail.jpg"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Duration (seconds) <span className="text-red-400">*</span>
//             </label>
//             <input
//               type="number"
//               name="durationSeconds"
//               value={formData.durationSeconds}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
//               placeholder="0"
//               min="0"
//               required
//             />
//           </div>

//           <div className="flex space-x-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Uploading...' : 'Upload Video'}
//             </button>
//             <button
//               type="button"
//               onClick={() => navigate('/videos')}
//               className="px-6 py-3 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, Film, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { api } from '../services/api';

export default function UploadView() {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setError('');
    } else {
      setError('Please upload a valid video file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    },
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024, // 500MB
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    // DEBUG: Check what we're sending
  console.log('=== Upload Debug ===');
  console.log('Video file:', videoFile);
  console.log('File name:', videoFile.name);
  console.log('File size:', videoFile.size);
  console.log('File type:', videoFile.type);
  console.log('Title:', formData.title);
  console.log('Description:', formData.description);
  console.log('===================');

    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', videoFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);

      // Upload with progress tracking
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/videos/upload-file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${api.getToken()}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Upload failed');

      setSuccess(true);
      setFormData({ title: '', description: '' });
      setVideoFile(null);
      setVideoPreview(null);
      
      setTimeout(() => {
        setSuccess(false);
        navigate('/videos');
      }, 2000);
    } catch (err) {
      console.error('Upload failed', err);
      setError(err.message || 'Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <Upload className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Upload Video</h1>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>Video uploaded successfully! Redirecting...</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Video Upload Dropzone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video File <span className="text-red-400">*</span>
            </label>
            
            {!videoFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/20 hover:border-purple-500/50 bg-white/5'
                }`}
              >
                <input {...getInputProps()} />
                <Film className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-white text-lg">Drop the video here...</p>
                ) : (
                  <>
                    <p className="text-white text-lg mb-2">
                      Drag & drop your video here
                    </p>
                    <p className="text-gray-400 text-sm">
                      or click to browse (MP4, MOV, AVI, MKV, WebM - Max 500MB)
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="border border-white/20 rounded-xl overflow-hidden">
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-h-96"
                />
                <div className="p-4 bg-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{videoFile.name}</p>
                    <p className="text-gray-400 text-sm">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="Enter video title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 min-h-[100px]"
              placeholder="Enter video description"
            />
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading || !videoFile}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? `Uploading... ${uploadProgress}%` : 'Upload Video'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/videos')}
              className="px-6 py-3 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

