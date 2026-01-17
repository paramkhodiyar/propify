// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { Home, Menu, X, User, LogOut } from 'lucide-react';

// export function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userRole, setUserRole] = useState<string>('');
//   const [userName, setUserName] = useState<string>('');
//   const router = useRouter();

//   // Function to check auth state
//   const checkAuthState = () => {
//     const token = localStorage.getItem('authToken');
//     const role = localStorage.getItem('userRole');
//     const name = localStorage.getItem('userName');

//     if (token) {
//       setIsLoggedIn(true);
//       setUserRole(role || '');
//       setUserName(name || role || 'User'); // Fallback to role if no name
//     } else {
//       setIsLoggedIn(false);
//       setUserRole('');
//       setUserName('');
//     }
//   };

//   useEffect(() => {
//     checkAuthState();

//     // Listen for storage changes (when login happens in another tab/window)
//     const handleStorageChange = () => {
//       checkAuthState();
//     };

//     window.addEventListener('storage', handleStorageChange);

//     // Listen for custom login events
//     const handleLoginEvent = () => {
//       checkAuthState();
//     };

//     window.addEventListener('userLoggedIn', handleLoginEvent);

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//       window.removeEventListener('userLoggedIn', handleLoginEvent);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userRole');
//     localStorage.removeItem('userName');
//     setIsLoggedIn(false);
//     setUserRole('');
//     setUserName('');
//     router.push('/');
//   };

//   return (
//     <nav className="bg-white shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2">
//             <Home className="w-8 h-8 text-amber-600" />
//             <span className="text-2xl font-bold text-gray-900">Propify Real Estate</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link href="/" className="text-gray-700 hover:text-amber-600 transition-colors">
//               Home
//             </Link>
//             <Link href="/properties" className="text-gray-700 hover:text-amber-600 transition-colors">
//               Properties
//             </Link>
//             <Link href="/about" className="text-gray-700 hover:text-amber-600 transition-colors">
//               About
//             </Link>
//             <Link href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors">
//               Contact
//             </Link>
//             {isLoggedIn ? (
//               <div className="flex items-center space-x-4">
//                 {/* User greeting */}
//                 <span className="text-gray-700 flex items-center space-x-1">
//                   <User className="w-4 h-4" />
//                   <span>Hi, {userName}</span>
//                 </span>

//                 {userRole === 'admin' && (
//                   <Link 
//                     href="/dashboard" 
//                     className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
//                   >
//                     Dashboard
//                   </Link>
//                 )}
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center space-x-1 text-gray-700 hover:text-amber-600 transition-colors"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             ) : (
//               <Link 
//                 href="/login" 
//                 className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
//               >
//                 Login
//               </Link>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2"
//           >
//             {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden bg-white border-t">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               <Link 
//                 href="/" 
//                 className="block px-3 py-2 text-gray-700 hover:text-amber-600 transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Home
//               </Link>
//               <Link 
//                 href="/properties" 
//                 className="block px-3 py-2 text-gray-700 hover:text-amber-600 transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Properties
//               </Link>
//               <Link 
//                 href="/about" 
//                 className="block px-3 py-2 text-gray-700 hover:text-amber-600 transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 About
//               </Link>
//               <Link 
//                 href="/contact" 
//                 className="block px-3 py-2 text-gray-700 hover:text-amber-600 transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Contact
//               </Link>
//               {isLoggedIn ? (
//                 <div className="space-y-1">
//                   {/* Mobile user greeting */}
//                   <div className="px-3 py-2 text-gray-700 flex items-center space-x-1">
//                     <User className="w-4 h-4" />
//                     <span>Hi, {userName}</span>
//                   </div>

//                   {userRole === 'admin' && (
//                     <Link 
//                       href="/dashboard" 
//                       className="block px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       Dashboard
//                     </Link>
//                   )}
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setIsMenuOpen(false);
//                     }}
//                     className="block w-full text-left px-3 py-2 text-gray-700 hover:text-amber-600 transition-colors"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               ) : (
//                 <Link 
//                   href="/login" 
//                   className="block px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Home className="w-8 h-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-900">Propify Real Estate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-amber-600 transition-colors">
              Home
            </Link>
            <Link href="/properties" className="text-gray-700 hover:text-amber-600 transition-colors">
              Properties
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-amber-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors">
              Contact
            </Link>
            <Link href="/maya-ai" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors animate-pulse">
              MayaAI
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-amber-600 transition-colors focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold border border-amber-200">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      (user.name || 'U').charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="font-medium hidden lg:block">{user.name}</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                      Signed in as <br />
                      <span className="font-medium text-gray-900 truncate block">{user.email}</span>
                    </div>

                    {user.role === 'user' ? (
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                    ) : (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                      >
                        <Menu className="w-4 h-4" />
                        Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/properties"
                className="block px-3 py-2 text-gray-700 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Properties
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/maya-ai"
                className="block px-3 py-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors animate-pulse"
                onClick={() => setIsMenuOpen(false)}
              >
                MayaAI
              </Link>
              {user ? (
                <div className="space-y-1">
                  {/* Mobile user greeting */}
                  <div className="px-3 py-2 text-gray-700 flex items-center space-x-3 bg-gray-50 rounded-lg mb-2">
                    <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold">
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{user.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                    </div>
                  </div>

                  {user.role === 'user' ? (
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Menu className="w-4 h-4" />
                      Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors mx-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}