
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const location = useLocation();
  
  const navItems = [
    { label: 'Converter', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' }
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center max-w-6xl">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-all duration-300">
            <span className="text-white font-black text-xl">i</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-950 dark:text-white">
            imageto<span className="text-indigo-600">.org</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 p-1 bg-slate-200/40 dark:bg-slate-900/40 rounded-xl border border-slate-300/30 dark:border-slate-800/50">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                location.pathname === item.path 
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all bg-white dark:bg-slate-900 shadow-sm"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            )}
          </button>
          <div className="hidden sm:flex items-center px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 rounded-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2.5"></div>
            <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest leading-none">Safe Sandbox</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
