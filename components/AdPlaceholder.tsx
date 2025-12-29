
import React from 'react';

interface AdPlaceholderProps {
  type: 'leaderboard' | 'rectangle' | 'box' | 'inline' | 'skyscraper' | 'multiplex' | 'in-feed';
  label?: string;
  className?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ type, label = 'ADVERTISEMENT', className = "" }) => {
  // Standard IAB Ad Sizes for AdSense compliance & High RPM
  const styles = {
    leaderboard: 'w-full max-w-[728px] h-[90px] mx-auto', 
    rectangle: 'w-[300px] h-[250px] mx-auto', 
    box: 'w-full max-w-[336px] h-[280px] mx-auto', 
    inline: 'w-full h-[60px]',
    skyscraper: 'hidden xl:flex w-[160px] h-[600px] sticky top-24', // High-earning sidebar
    multiplex: 'w-full grid grid-cols-2 md:grid-cols-4 gap-4 h-auto py-4', // Grid format for bottom of pages
    'in-feed': 'w-full max-w-[600px] h-[120px] mx-auto' // Optimized for blog lists
  };

  if (type === 'multiplex') {
    return (
      <div className={`my-12 ${className}`}>
        <div className="text-center mb-4">
          <span className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">{label}</span>
        </div>
        <div className={styles.multiplex}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl h-48 flex items-center justify-center opacity-40">
               <div className="text-center">
                 <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-2"></div>
                 <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 rounded mx-auto mb-1"></div>
                 <div className="h-2 w-12 bg-slate-200 dark:bg-slate-800 rounded mx-auto"></div>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${styles[type]} ${className} bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl flex flex-col items-center justify-center transition-all overflow-hidden border-dashed`}>
      {/* Policy-compliant label */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2">
        <span className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-600">{label}</span>
      </div>
      
      <div className="text-center opacity-20 group-hover:opacity-40 transition-opacity">
        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Partner Content Slot</p>
      </div>

      <div className="absolute bottom-2 right-3 opacity-0 group-hover:opacity-30 transition-opacity">
        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">AdChoice</span>
      </div>
    </div>
  );
};

export default AdPlaceholder;
