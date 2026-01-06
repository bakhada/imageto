
import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl animate-entrance">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex-grow text-center md:text-left">
          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">Privacy Transparency</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
            We use standard cookies to ensure the best experience and to serve relevant advertisements via Google AdSense. Your image data remains strictly local and is never tracked.
          </p>
        </div>
        <div className="flex items-center space-x-4 flex-shrink-0">
          <button 
            onClick={accept}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
          >
            I Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
