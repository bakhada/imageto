
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CropArea } from '../types';

interface VisualCropperProps {
  imageUrl: string;
  aspect?: string; // e.g. "1:1"
  onSave: (crop: CropArea) => void;
  onCancel: () => void;
}

const VisualCropper: React.FC<VisualCropperProps> = ({ imageUrl, aspect, onSave, onCancel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<CropArea>({ x: 10, y: 10, width: 80, height: 80, unit: '%' });
  const [dragging, setDragging] = useState<{ type: 'move' | 'resize'; handle?: string; startX: number; startY: number; startCrop: CropArea } | null>(null);

  const targetAspect = aspect ? aspect.split(':').map(Number).reduce((a, b) => a / b) : null;

  useEffect(() => {
    // Reset crop when image changes or aspect changes
    setCrop({ x: 10, y: 10, width: 80, height: 80, unit: '%' });
  }, [imageUrl, aspect]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, type: 'move' | 'resize', handle?: string) => {
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragging({ type, handle, startX: clientX, startY: clientY, startCrop: { ...crop } });
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging || !containerRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const dx = ((clientX - dragging.startX) / containerRef.current.offsetWidth) * 100;
    const dy = ((clientY - dragging.startY) / containerRef.current.offsetHeight) * 100;

    let newCrop = { ...dragging.startCrop };

    if (dragging.type === 'move') {
      newCrop.x = Math.max(0, Math.min(100 - newCrop.width, newCrop.x + dx));
      newCrop.y = Math.max(0, Math.min(100 - newCrop.height, newCrop.y + dy));
    } else if (dragging.type === 'resize' && dragging.handle) {
      if (dragging.handle.includes('e')) {
        newCrop.width = Math.max(5, Math.min(100 - newCrop.x, newCrop.width + dx));
      }
      if (dragging.handle.includes('s')) {
        newCrop.height = Math.max(5, Math.min(100 - newCrop.y, newCrop.height + dy));
      }
      if (dragging.handle.includes('w')) {
        const prevRight = newCrop.x + newCrop.width;
        newCrop.x = Math.max(0, Math.min(prevRight - 5, newCrop.x + dx));
        newCrop.width = prevRight - newCrop.x;
      }
      if (dragging.handle.includes('n')) {
        const prevBottom = newCrop.y + newCrop.height;
        newCrop.y = Math.max(0, Math.min(prevBottom - 5, newCrop.y + dy));
        newCrop.height = prevBottom - newCrop.y;
      }

      // Enforce aspect ratio if required
      if (targetAspect && imgRef.current) {
        const imgAspect = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
        // In percentage space, we need to adjust for the container's aspect ratio
        // Percentage Width * containerWidth / (Percentage Height * containerHeight) = targetAspect
        // Since containerWidth/containerHeight = imgAspect
        // (W * imgAspect) / H = targetAspect => W = targetAspect * H / imgAspect
        if (dragging.handle.includes('e') || dragging.handle.includes('w')) {
            newCrop.height = (newCrop.width * imgAspect) / targetAspect;
            if (newCrop.y + newCrop.height > 100) {
                newCrop.height = 100 - newCrop.y;
                newCrop.width = (newCrop.height * targetAspect) / imgAspect;
            }
        } else {
            newCrop.width = (newCrop.height * targetAspect) / imgAspect;
            if (newCrop.x + newCrop.width > 100) {
                newCrop.width = 100 - newCrop.x;
                newCrop.height = (newCrop.width * imgAspect) / targetAspect;
            }
        }
      }
    }

    setCrop(newCrop);
  }, [dragging, targetAspect]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-950/90 backdrop-blur-xl animate-entrance">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-full max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Visual Crop Engine</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Manual Coordinate Synthesis</p>
          </div>
          <button onClick={onCancel} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-grow overflow-hidden flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-950/50">
          <div ref={containerRef} className="relative max-w-full max-h-full inline-block shadow-2xl">
            <img 
              ref={imgRef}
              src={imageUrl} 
              alt="Crop Source" 
              className="max-w-full max-h-[60vh] block select-none pointer-events-none"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
            {/* Selection Area */}
            <div 
              className="absolute border-2 border-indigo-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] cursor-move transition-shadow"
              style={{ 
                left: `${crop.x}%`, 
                top: `${crop.y}%`, 
                width: `${crop.width}%`, 
                height: `${crop.height}%` 
              }}
              onMouseDown={(e) => handleMouseDown(e, 'move')}
              onTouchStart={(e) => handleMouseDown(e, 'move')}
            >
              {/* Guides */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30 pointer-events-none">
                <div className="border-r border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-b border-white"></div>
              </div>

              {/* Handles */}
              {['nw', 'ne', 'sw', 'se'].map(handle => (
                <div 
                  key={handle}
                  className={`absolute w-5 h-5 bg-white border-2 border-indigo-600 rounded-full shadow-lg z-10 -translate-x-1/2 -translate-y-1/2 cursor-${handle === 'nw' || handle === 'se' ? 'nwse' : 'nesw'}-resize`}
                  style={{ 
                    top: handle.includes('n') ? '0%' : '100%', 
                    left: handle.includes('w') ? '0%' : '100%' 
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'resize', handle)}
                  onTouchStart={(e) => handleMouseDown(e, 'resize', handle)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="text-center md:text-left">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Active Bounds</span>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                {Math.round(crop.x)}%, {Math.round(crop.y)}% | {Math.round(crop.width)}% x {Math.round(crop.height)}%
              </span>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <button 
              onClick={onCancel}
              className="flex-1 md:px-10 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
             >
               Discard
             </button>
             <button 
              onClick={() => onSave(crop)}
              className="flex-1 md:px-12 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all"
             >
               Commit Frame
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualCropper;
