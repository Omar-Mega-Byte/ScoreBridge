import { Palette, Check } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, changeTheme, themes } = useTheme();

  const themeColors = {
    default: 'bg-blue-500',
    cyberpunk: 'bg-fuchsia-500',
    neon: 'bg-lime-500',
    sunset: 'bg-orange-600',
    midnight: 'bg-purple-600',
    aurora: 'bg-teal-400',
    volcano: 'bg-red-600',
    royal: 'bg-indigo-600',
    matrix: 'bg-emerald-600',
    sakura: 'bg-pink-400'
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Change Theme"
      >
        <Palette size={20} className="text-gray-700" />
        <span className="hidden md:inline text-gray-700">Theme</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl py-4 z-40 border-2 border-gray-100">
            <div className="px-4 pb-3 border-b border-gray-200">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Palette size={20} className="text-primary-600" />
                Choose Your Theme
              </h3>
              <p className="text-xs text-gray-500 mt-1">Personalize your experience</p>
            </div>
            
            <div className="px-4 py-3 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => {
                      changeTheme(key);
                      setIsOpen(false);
                    }}
                    className={`
                      relative p-4 rounded-lg border-2 transition-all text-left
                      ${currentTheme === key 
                        ? 'border-primary-600 bg-primary-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-full ${themeColors[key]} shadow-md`}></div>
                      <span className="font-semibold text-sm text-gray-800">
                        {theme.name}
                      </span>
                    </div>
                    
                    {/* Color Preview */}
                    <div className="flex gap-1 mt-2">
                      {Object.values(theme.colors.primary).slice(3, 8).map((color, idx) => (
                        <div 
                          key={idx}
                          className="w-full h-2 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* Check Mark */}
                    {currentTheme === key && (
                      <div className="absolute top-2 right-2 bg-primary-600 rounded-full p-1">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 pt-3 border-t border-gray-200 mt-3">
              <p className="text-xs text-gray-500 text-center">
                🎨 Theme applies across all pages instantly!
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
