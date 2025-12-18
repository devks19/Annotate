// import { Outlet } from 'react-router-dom';
// import Navbar from './Navbar';

// export default function Layout() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
//       <Navbar />
//       <main className="container mx-auto px-4 py-8">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-page">
        <Outlet />
      </main>
    </div>
  );
}