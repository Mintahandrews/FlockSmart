import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Award, BookMarked, BookOpen, CreditCard, GraduationCap, LogOut, Menu, MessageSquare, Search, Shield, User, Users, X } from 'lucide-react';
import { useMessages } from '../contexts/MessageContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useMessages();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-sm relative">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-bold text-xl text-indigo-600 flex items-center gap-2">
            <BookOpen size={24} />
            <span>PeerLearn</span>
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-indigo-600"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 mx-3">
                  Dashboard
                </Link>
                <Link to="/services" className="text-gray-700 hover:text-indigo-600 mx-3 flex items-center gap-1">
                  <Search size={16} />
                  Services
                </Link>
                <Link to="/tutors" className="text-gray-700 hover:text-indigo-600 mx-3 flex items-center gap-1">
                  <GraduationCap size={16} />
                  Tutors
                </Link>
                <Link to="/messages" className="text-gray-700 hover:text-indigo-600 mx-3 flex items-center gap-1 relative">
                  <MessageSquare size={16} />
                  Messages
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/resources" className="text-gray-700 hover:text-indigo-600 mx-3 flex items-center gap-1">
                  <BookMarked size={16} />
                  Resources
                </Link>
                <Link to="/study-groups" className="text-gray-700 hover:text-indigo-600 mx-3 flex items-center gap-1">
                  <Users size={16} />
                  Study Groups
                </Link>
                <Link to="/achievements" className="text-gray-700 hover:text-indigo-600 mx-3 flex items-center gap-1">
                  <Award size={16} />
                  Achievements
                </Link>
                <Link to="/wallet" className="text-gray-700 hover:text-indigo-600 mx-3 flex items-center gap-1">
                  <CreditCard size={16} />
                  Wallet
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-indigo-600 mx-3 flex items-center gap-1">
                  <User size={16} />
                  Profile
                </Link>
                <Link to="/academic-integrity" className="text-gray-700 hover:text-indigo-600 mx-3 flex items-center gap-1">
                  <Shield size={16} />
                  Integrity
                </Link>
                <button 
                  onClick={logout}
                  className="ml-4 flex items-center gap-1 text-gray-700 hover:text-indigo-600"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/tutors" className="text-gray-700 hover:text-indigo-600 mx-3 flex items-center gap-1">
                  <GraduationCap size={16} />
                  Tutors
                </Link>
                <Link to="/academic-integrity" className="text-gray-700 hover:text-indigo-600 mx-3 flex items-center gap-1">
                  <Shield size={16} />
                  Integrity
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 mx-3">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50`}>
            <div className="flex flex-col py-2">
              {user ? (
                <>
                  <Link to="/dashboard" className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                    Dashboard
                  </Link>
                  <Link to="/services" className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2">
                    <Search size={16} />
                    Services
                  </Link>
                  <Link to="/tutors" className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2">
                    <GraduationCap size={16} />
                    Tutors
                  </Link>
                  <Link to="/messages" className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 relative">
                    <MessageSquare size={16} />
                    Messages
                    {unreadCount > 0 && (
                      <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/resources" className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2">
                    <BookMarked size={16} />
                    Resources
                  </Link>
                  <Link to="/study-groups" className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2">
                    <Users size={16} />
                    Study Groups
                  </Link>
                  <Link to="/achievements" className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2">
                    <Award size={16} />
                    Achievements
                  </Link>
                  <Link to="/wallet" className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2">
                    <CreditCard size={16} />
                    Wallet
                  </Link>
                  <Link to="/profile" className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2">
                    <User size={16} />
                    Profile
                  </Link>
                  <Link to="/academic-integrity" className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2">
                    <Shield size={16} />
                    Integrity
                  </Link>
                  <button 
                    onClick={logout}
                    className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 w-full text-left"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/tutors" className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2">
                    <GraduationCap size={16} />
                    Tutors
                  </Link>
                  <Link to="/academic-integrity" className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2">
                    <Shield size={16} />
                    Integrity
                  </Link>
                  <Link to="/login" className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="mx-4 my-2 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
