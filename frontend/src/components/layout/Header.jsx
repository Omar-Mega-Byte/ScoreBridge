import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, TrendingUp, User, LogOut, LayoutDashboard, ChevronDown, Sparkles, Calculator as CalcIcon, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import ThemeSwitcher from '../common/ThemeSwitcher';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={`bg-white shadow-md sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="ScoreBridge Logo" className={`object-contain transition-all duration-300 ${isScrolled ? 'h-8 w-8' : 'h-10 w-10'}`} />
            <span className={`font-bold text-gray-800 transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
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
                
                {/* AI Features Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                    <Sparkles size={18} />
                    <span>AI Features</span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                    <Link to="/recommendations" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 flex items-center gap-2">
                      <Target size={16} className="text-purple-600" />
                      <div>
                        <div className="font-medium text-sm">Recommendations</div>
                        <div className="text-xs text-gray-500">AI-powered advice</div>
                      </div>
                    </Link>
                    <Link to="/score-simulator" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 flex items-center gap-2">
                      <CalcIcon size={16} className="text-blue-600" />
                      <div>
                        <div className="font-medium text-sm">Score Simulator</div>
                        <div className="text-xs text-gray-500">What-if scenarios</div>
                      </div>
                    </Link>
                  </div>
                </div>
                
                <Link to="/score-history" className="text-gray-700 hover:text-primary-600 transition-colors">
                  History
                </Link>
                <Link to="/accounts" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Accounts
                </Link>
                
                {/* Theme Switcher */}
                <ThemeSwitcher />
                
                {/* User Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                    <User size={20} />
                    <span>{user?.name || 'User'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                    {/* Hackathon Notice */}
                    <div className="px-4 py-2 bg-gradient-to-r from-primary-50 to-warning-50 border-l-4 border-primary-600 mb-2">
                      <p className="text-xs font-semibold text-primary-700">🏆 HackNomics 2025</p>
                      <p className="text-xs text-gray-600 mt-1">Some features will be enhanced after the hackathon!</p>
                    </div>
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
                
                {/* Theme Switcher */}
                <ThemeSwitcher />
                
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
                <div className="py-2 border-l-4 border-purple-500 pl-3 my-2">
                  <p className="text-xs font-semibold text-purple-600 mb-2 flex items-center gap-1">
                    <Sparkles size={14} /> AI Features
                  </p>
                  <Link to="/recommendations" className="block py-1 text-gray-700 hover:text-primary-600 text-sm">
                    → AI Recommendations
                  </Link>
                  <Link to="/score-simulator" className="block py-1 text-gray-700 hover:text-primary-600 text-sm">
                    → Score Simulator
                  </Link>
                </div>
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
