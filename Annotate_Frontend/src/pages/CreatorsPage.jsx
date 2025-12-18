// // src/pages/CreatorsPage.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Search, Users, Video } from 'lucide-react';
// import { api } from '../services/api';
// import useAuth from '../hooks/useAuth';

// export default function CreatorsPage() {
//   const navigate = useNavigate();
//   const [creators, setCreators] = useState([]);
//   const [filteredCreators, setFilteredCreators] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadCreators();
//   }, []);

//   const loadCreators = async () => {
//     try {
//       setLoading(true);
//       // const allCreators = await api.users.getCreators();

//       if (user.role === 'VIEWER') {
//         // Viewers only see creators they have access to
//         allCreators = await api.users.getAccessibleCreators();
//       } else {
//         // Admins/Creators see all creators
//         allCreators = await api.users.getCreators();
//       }

//       setCreators(allCreators);
//       setFilteredCreators(allCreators);
//     } catch (err) {
//       console.error('Failed to load creators', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);

//     if (!query.trim()) {
//       setFilteredCreators(creators);
//       return;
//     }

//     const filtered = creators.filter((creator) =>
//       creator.username.toLowerCase().includes(query.toLowerCase()) ||
//       creator.name.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredCreators(filtered);
//   };

//   const handleCreatorClick = (id) => {
//     navigate(`/creators/${id}`);
//   };

//   if (loading) {
//     return <div className="text-white">Loading creators...</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         {/* <h1 className="text-3xl font-bold text-white">Discover Creators</h1>
//         <div className="flex items-center space-x-2 text-gray-400">
//           <Users className="w-5 h-5" />
//           <span>{filteredCreators.length} creators</span> */}

// <h1 className="text-3xl font-bold text-white">
//           {user.role === 'VIEWER' ? 'My Creators' : 'Discover Creators'}
//         </h1>
//         <div className="flex items-center space-x-2 text-gray-400">
//           <Users className="w-5 h-5" />
//           <span>{filteredCreators.length} creators</span>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="relative">
//         <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search creators by name..."
//           value={searchQuery}
//           onChange={handleSearch}
//           className="w-full pl-12 pr-4 py-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-all"
//         />
//       </div>

//       {/* Creators Grid */}
//       <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
//         {filteredCreators.length === 0 ? (
//           <div className="text-center py-12">
//             <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//             {/* <p className="text-gray-400">
//               {searchQuery ? 'No creators found matching your search' : 'No creators available'}
//             </p> */}
            
//             {user.role === 'VIEWER' ? (
//               <div>
//                 <p className="text-gray-400 mb-2">
//                   {searchQuery ? 'No creators found matching your search' : 'No accessible creators yet'}
//                 </p>
//                 {!searchQuery && (
//                   <p className="text-gray-500 text-sm">
//                     Unlock videos to see their creators here
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <p className="text-gray-400">
//                 {searchQuery ? 'No creators found matching your search' : 'No creators available'}
//               </p>
//             )}

//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredCreators.map((creator) => (
//               <div
//                 key={creator.id}
//                 onClick={() => handleCreatorClick(creator.id)}
//                 className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group"
//               >
//                 <div className="flex items-start space-x-4">
//                   {/* Avatar */}
//                   <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
//                     <span className="text-2xl font-bold text-white">
//                       {creator.name.charAt(0).toUpperCase()}
//                     </span>
//                   </div>

//                   {/* Creator Info */}
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
//                       {creator.name}
//                     </h3>
//                     <p className="text-sm text-gray-400 truncate">@{creator.username}</p>
                    
//                     <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
//                       <div className="flex items-center space-x-1">
//                         <Video className="w-4 h-4" />
//                         {/* <span>{creator.videoCount || 0} videos</span> */}
//                         <span>
//                           {creator.videoCount || 0} video{creator.videoCount !== 1 ? 's' : ''}
//                           {user.role === 'VIEWER' ? ' accessible' : ''}
//                         </span>
//                       </div>
//                     </div>
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
import { useNavigate } from 'react-router-dom';
import { Search, Users, Video } from 'lucide-react';
import { api } from '../services/api';
import useAuth from '../hooks/useAuth';

export default function CreatorsPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Get user
  const [creators, setCreators] = useState([]);
  const [filteredCreators, setFilteredCreators] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Only load when user is available
    if (user) {
      loadCreators();
    }
  }, [user]); // ✅ Add user to dependencies

  const loadCreators = async () => {
    try {
      setLoading(true);
      let allCreators;
      
      // ✅ Check user exists before accessing role
      if (user && user.role === 'VIEWER') {
        allCreators = await api.users.getAccessibleCreators();
      } else {
        allCreators = await api.users.getCreators();
      }
      
      setCreators(allCreators);
      setFilteredCreators(allCreators);
    } catch (err) {
      console.error('Failed to load creators', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredCreators(creators);
      return;
    }

    const filtered = creators.filter((creator) =>
      creator.name.toLowerCase().includes(query.toLowerCase()) ||
      (creator.email && creator.email.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredCreators(filtered);
  };

  const handleCreatorClick = (id) => {
    navigate(`/creators/${id}`);
  };

  // ✅ Show loading while user is being loaded
  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Loading creators...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {/* ✅ Safe to access user.role now */}
        <h1 className="text-3xl font-bold text-white">
          {user.role === 'VIEWER' ? 'My Creators' : 'Discover Creators'}
        </h1>
        <div className="flex items-center space-x-2 text-gray-400">
          <Users className="w-5 h-5" />
          <span>{filteredCreators.length} creators</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search creators by name..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-12 pr-4 py-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-all"
        />
      </div>

      {/* Creators Grid */}
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        {filteredCreators.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            {user.role === 'VIEWER' ? (
              <div>
                <p className="text-gray-400 mb-2">
                  {searchQuery ? 'No creators found matching your search' : 'No accessible creators yet'}
                </p>
                {!searchQuery && (
                  <p className="text-gray-500 text-sm">
                    Unlock videos to see their creators here
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-400">
                {searchQuery ? 'No creators found matching your search' : 'No creators available'}
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map((creator) => (
              <div
                key={creator.id}
                onClick={() => handleCreatorClick(creator.id)}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-white">
                      {creator.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Creator Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                      {creator.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">{creator.email}</p>
                    
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Video className="w-4 h-4" />
                        <span>
                          {creator.videoCount || 0} video{creator.videoCount !== 1 ? 's' : ''}
                          {user.role === 'VIEWER' ? ' accessible' : ''}
                        </span>
                      </div>
                    </div>
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
