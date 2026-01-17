import React from 'react';

interface ExternalAdProps {
  className?: string;
  label?: string;
}

const ExternalAd: React.FC<ExternalAdProps> = ({ className = "", label = "ADVERTISEMENT" }) => {
  return (
    <div className={`my-12 flex flex-col items-center justify-center ${className}`}>
      {/* AdSense-compliant label */}
      <div className="mb-3">
        <span className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-600">
          {label}
        </span>
      </div>
      
      {/* A-Ads Unit Container */}
      <div 
        id="frame" 
        className="w-full bg-white/50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm overflow-hidden"
        style={{ position: 'relative', zIndex: 99998 }}
      >
        <iframe 
          data-aa='2424512' 
          src='//acceptable.a-ads.com/2424512/?size=Adaptive&background_color=ffffff&title_color=dd2121&link_color=009aff&link_hover_color=320606'
          className="w-full md:w-[80%] mx-auto"
          style={{ border: 0, padding: 0, height: 'auto', minHeight: '90px', overflow: 'hidden', display: 'block' }}
        ></iframe>
      </div>
      
      <div className="mt-2 opacity-30">
        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Powered by A-Ads</span>
      </div>
    </div>
  );
};

export default ExternalAd;