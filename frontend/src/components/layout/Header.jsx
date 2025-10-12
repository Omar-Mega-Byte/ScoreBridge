import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, TrendingUp, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              Score<span className="text-primary-600">Bridge</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/calculate-score" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Calculate Score
                </Link>
                <Link to="/score-history" className="text-gray-700 hover:text-primary-600 transition-colors">
                  History
                </Link>
                <Link to="/accounts" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Accounts
                </Link>
                
                {/* User Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                    <User size={20} />
                    <span>{user?.name || 'User'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Profile
                    </Link>
                    <Link to="/financial-profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Financial Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/calculate-score" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Calculate Score
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-slideIn">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                <Link to="/calculate-score" className="block py-2 text-gray-700 hover:text-primary-600">
                  Calculate Score
                </Link>
                <Link to="/score-history" className="block py-2 text-gray-700 hover:text-primary-600">
                  History
                </Link>
                <Link to="/accounts" className="block py-2 text-gray-700 hover:text-primary-600">
                  Accounts
                </Link>
                <Link to="/profile" className="block py-2 text-gray-700 hover:text-primary-600">
                  My Profile
                </Link>
                <Link to="/financial-profile" className="block py-2 text-gray-700 hover:text-primary-600">
                  Financial Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/calculate-score" className="block py-2 text-gray-700 hover:text-primary-600">
                  Calculate Score
                </Link>
                <Link to="/login" className="block py-2 text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="block py-2 text-primary-600 font-medium">
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
