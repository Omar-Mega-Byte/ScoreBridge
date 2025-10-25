import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, TrendingUp } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="ScoreBridge Logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold text-white">
                Score<span className="text-primary-400">Bridge</span>
              </span>
            </div>
            <p className="text-sm">
              Fair, transparent, and intelligent credit scoring for everyone.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/calculate-score" className="hover:text-primary-400 transition-colors">Calculate Score</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/accounts" className="hover:text-primary-400 transition-colors">Manage Accounts</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary-400 transition-colors">How It Works</Link></li>
              <li><a href="https://github.com/Omar-Mega-Byte/ScoreBridge_HackNomics" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">GitHub Repository</a></li>
              <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect with Team</h3>
            <div className="space-y-3">
              {/* Omar */}
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Omar Elrfaay</p>
                <div className="flex space-x-3">
                  <a href="https://github.com/Omar-Mega-Byte" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors" title="GitHub">
                    <Github size={18} />
                  </a>
                  <a href="https://www.linkedin.com/in/omar-elrfaay/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors" title="LinkedIn">
                    <Linkedin size={18} />
                  </a>
                  <a href="mailto:omar.tolis2004@gmail.com" className="hover:text-primary-400 transition-colors" title="Email">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
              
              {/* Shahd */}
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Shahd Khaled</p>
                <div className="flex space-x-3">
                  <a href="https://github.com/shahdkh2288" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors" title="GitHub">
                    <Github size={18} />
                  </a>
                  <a href="https://www.linkedin.com/in/shahd-khaled-2b6897247/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors" title="LinkedIn">
                    <Linkedin size={18} />
                  </a>
                  <a href="mailto:kshahd528@gmail.com" className="hover:text-primary-400 transition-colors" title="Email">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            </div>
            <p className="text-sm mt-4 text-primary-400 font-medium">
              🏆 Built for HackNomics 2025
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>&copy; 2025 ScoreBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
