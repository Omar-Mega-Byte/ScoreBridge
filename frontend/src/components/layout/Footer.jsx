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
              <div className="bg-primary-600 p-2 rounded-lg">
                <TrendingUp className="text-white" size={20} />
              </div>
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
              <li><a href="#" className="hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Mail size={20} />
              </a>
            </div>
            <p className="text-sm mt-4">
              Built for HackNomics 2025
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
