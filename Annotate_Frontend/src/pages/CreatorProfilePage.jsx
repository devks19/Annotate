// // src/pages/CreatorProfilePage.jsx
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Video, ArrowLeft, Calendar } from 'lucide-react';
// import { api } from '../services/api';
// import useAuth from '../hooks/useAuth';

// export default function CreatorProfilePage() {
//   const { id } = useParams();
//   // const { username } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [creator, setCreator] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadCreatorProfile();
//   }, [id]);

//   const loadCreatorProfile = async () => {
//     try {
//       setLoading(true);
//       const creatorData = await api.users.getCreatorById(id);
//       setCreator(creatorData);

//       // let creatorVideos;
//       // if (user?.role === 'CREATOR' && user.userId === creatorData.id) {
//       //   creatorVideos = await api.videos.getByCreator(creatorData.id);
//       // } else {
//       //   creatorVideos = await api.videos.getPublishedByCreator(creatorData.id);
//       // }

//       // Get videos by creator
//       const creatorVideos = await api.videos.getByCreator(id);
      
//       // ✅ Filter published videos for non-owner viewers
//       if (user?.userId === creatorData.id) {
//         // Creator sees all their videos (published + drafts)
//         setVideos(creatorVideos);
//       } else {
//         // Others only see published videos
//         setVideos(creatorVideos.filter(v => v.isPublished));
//       }
      
//       setVideos(creatorVideos);
//     } catch (err) {
//       console.error('Failed to load creator profile', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVideoClick = (videoId) => {
//     navigate(`/videos/${videoId}`);
//   };

//   const handleBackClick = () => {
//     navigate(-1);
//   };

//   if (loading) {
//     return <div className="text-white">Loading profile...</div>;
//   }

//   if (!creator) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-gray-400">Creator not found</p>
//         <button
//           onClick={handleBackClick}
//           className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Back Button */}
//       <button
//         onClick={handleBackClick}
//         className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
//       >
//         <ArrowLeft className="w-5 h-5" />
//         <span>Back</span>
//       </button>

//       {/* Profile Header */}
//       <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
//         <div className="flex items-start space-x-6">
//           <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
//             <span className="text-4xl font-bold text-white">
//               {creator.name.charAt(0).toUpperCase()}
//             </span>
//           </div>

//           <div className="flex-1">
//             <h1 className="text-3xl font-bold text-white">{creator.name}</h1>
//             <p className="text-lg text-gray-400 mt-1">@{creator.username}</p>
            
//             {creator.bio && (
//               <p className="text-gray-300 mt-4 max-w-2xl">{creator.bio}</p>
//             )}

//             <div className="flex items-center space-x-6 mt-4 text-sm text-gray-400">
//               <div className="flex items-center space-x-2">
//                 <Video className="w-4 h-4" />
//                 <span>{videos.length} videos</span>
//               </div>
//               {creator.createdAt && (
//                 <div className="flex items-center space-x-2">
//                   <Calendar className="w-4 h-4" />
//                   <span>Joined {new Date(creator.createdAt).toLocaleDateString()}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Videos Section */}
//       <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
//         <h2 className="text-xl font-bold text-white mb-4">
//           {user?.userId === creator.id ? 'My Videos' : `Videos by ${creator.name}`}
//         </h2>

//         {videos.length === 0 ? (
//           <div className="text-center py-12">
//             <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//             <p className="text-gray-400">No videos available yet</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {videos.map((video) => (
//               <div
//                 key={video.id}
//                 onClick={() => handleVideoClick(video.id)}
//                 className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
//               >
//                 <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
//                   <Video className="w-12 h-12 text-white/50" />
//                 </div>
//                 <div className="p-4">
//                   <h3 className="font-medium text-white truncate">{video.title}</h3>
//                   {video.description && (
//                     <p className="text-sm text-gray-400 mt-1 line-clamp-2">
//                       {video.description}
//                     </p>
//                   )}
                  
//                   <div className="flex items-center justify-between mt-3">
//                     {video.isPublished ? (
//                       <span className="text-xs text-green-400">Published</span>
//                     ) : (
//                       <span className="text-xs text-yellow-400">Draft</span>
//                     )}
                    
//                     {video.createdAt && (
//                       <span className="text-xs text-gray-500">
//                         {new Date(video.createdAt).toLocaleDateString()}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, ArrowLeft, Calendar } from 'lucide-react';
import { api } from '../services/api';
import useAuth from '../hooks/useAuth';

export default function CreatorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Get user from auth hook
  const [creator, setCreator] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Wait for user to be loaded before fetching data
    if (user) {
      loadCreatorProfile();
    }
  }, [id, user]); // ✅ Add user to dependencies

  const loadCreatorProfile = async () => {
    try {
      setLoading(true);
      const creatorData = await api.users.getCreatorById(id);
      setCreator(creatorData);

      let creatorVideos;

      // ✅ Viewers only see videos they have access to
      if (user.role === 'VIEWER') {
        const allAccessible = await api.videos.getAccessibleVideos();
        creatorVideos = allAccessible.filter(
          video => video.creator.id === parseInt(id)
        );
      } 
      // ✅ Creator sees all their own videos (published + drafts)
      else if (user.userId === parseInt(id)) {
        creatorVideos = await api.videos.getByCreator(id);
      } 
      // ✅ Others (admins) see only published videos
      else {
        const allVideos = await api.videos.getByCreator(id);
        creatorVideos = allVideos.filter(v => v.isPublished);
      }

      setVideos(creatorVideos);
    } catch (err) {
      console.error('Failed to load creator profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (videoId) => {
    navigate(`/videos/${videoId}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // ✅ Show loading while user is being loaded
  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Creator not found</p>
        <button
          onClick={handleBackClick}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* Profile Header */}
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <span className="text-4xl font-bold text-white">
              {creator.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{creator.name}</h1>
            <p className="text-lg text-gray-400 mt-1">{creator.email}</p>
            
            {creator.bio && (
              <p className="text-gray-300 mt-4 max-w-2xl">{creator.bio}</p>
            )}

            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4" />
                <span>
                  {videos.length} video{videos.length !== 1 ? 's' : ''}
                  {user.role === 'VIEWER' ? ' accessible' : ''}
                </span>
              </div>
              {creator.createdAt && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(creator.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">
          {user.userId === parseInt(id) ? 'My Videos' : 
           user.role === 'VIEWER' ? 'Accessible Videos' :
           `Videos by ${creator.name}`}
        </h2>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {user.role === 'VIEWER' 
                ? 'No accessible videos from this creator yet'
                : 'No videos available yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video.id)}
                className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                  <Video className="w-12 h-12 text-white/50" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-white truncate">{video.title}</h3>
                  {video.description && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    {video.isPublished ? (
                      <span className="text-xs text-green-400">Published</span>
                    ) : (
                      <span className="text-xs text-yellow-400">Draft</span>
                    )}
                    
                    {video.createdAt && (
                      <span className="text-xs text-gray-500">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
