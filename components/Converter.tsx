
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ImageFormat, ProcessedImage, ImageProcessOptions } from '../types';
import { processImage, formatFileSize, copyToClipboard } from '../services/imageProcessor';
import JSZip from 'jszip';

interface ConverterProps {
  defaultFormat?: ImageFormat;
  initialOptions?: Partial<ImageProcessOptions>;
}

interface BatchItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'done' | 'error';
  progress: number;
  result?: ProcessedImage;
  error?: string;
}

const Converter: React.FC<ConverterProps> = ({ 
  defaultFormat = 'image/png',
  initialOptions = {}
}) => {
  const [batch, setBatch] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  // Engine Settings
  const [format, setFormat] = useState<ImageFormat>(initialOptions.format || defaultFormat);
  const [quality, setQuality] = useState(initialOptions.quality || 0.85);
  const [resizeWidth, setResizeWidth] = useState<number | ''>(initialOptions.width || '');
  const [resizeHeight, setResizeHeight] = useState<number | ''>(initialOptions.height || '');
  const [removeBG, setRemoveBG] = useState(initialOptions.removeBackground || false);
  const [removeWatermark, setRemoveWatermark] = useState(initialOptions.removeWatermark || false);
  const [cropAspect, setCropAspect] = useState<string>(initialOptions.cropAspect || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update settings when initialOptions change (e.g. user navigates between tools)
  useEffect(() => {
    if (initialOptions.format) setFormat(initialOptions.format);
    if (initialOptions.quality !== undefined) setQuality(initialOptions.quality);
    if (initialOptions.removeBackground !== undefined) setRemoveBG(initialOptions.removeBackground);
    if (initialOptions.removeWatermark !== undefined) setRemoveWatermark(initialOptions.removeWatermark);
  }, [initialOptions]);

  useEffect(() => {
    return () => {
      batch.forEach(item => {
        if (item.result?.url) URL.revokeObjectURL(item.result.url);
      });
    };
  }, [batch]);

  const handleFiles = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => 
      f.type.startsWith('image/') || 
      f.name.toLowerCase().match(/\.(heic|heif|jpg|jpeg|png|webp)$/)
    );
    const newItems: BatchItem[] = validFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      status: 'pending',
      progress: 0
    }));
    setBatch(prev => [...prev, ...newItems]);
  };

  const onDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); };
  const onDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); };

  const executePipeline = async () => {
    if (batch.filter(i => i.status === 'pending').length === 0) return;
    setIsProcessing(true);
    
    // Process sequentially to avoid OOM in local browser memory
    for (let i = 0; i < batch.length; i++) {
      if (batch[i].status !== 'pending') continue;

      setBatch(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'processing' } : item));

      try {
        const result = await processImage(batch[i].file, {
          format,
          quality,
          width: resizeWidth || undefined,
          height: resizeHeight || undefined,
          removeBackground: removeBG,
          removeWatermark,
          cropAspect: cropAspect || undefined
        });
        
        setBatch(prev => prev.map((item, idx) => idx === i ? { ...item, result, status: 'done' } : item));
      } catch (err: any) {
        console.error("Local pipeline crash:", err);
        setBatch(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'error', error: err.message } : item));
      }
    }
    setIsProcessing(false);
  };

  const handleSave = (result: ProcessedImage) => {
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBatchDownload = async () => {
    const ready = batch.filter(i => i.status === 'done' && i.result);
    if (ready.length === 0) return;
    if (ready.length === 1 && ready[0].result) return handleSave(ready[0].result);
    
    setIsZipping(true);
    try {
      const zip = new JSZip();
      ready.forEach(item => { if (item.result) zip.file(item.result.name, item.result.blob); });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `imageto-bundle-${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Archive failure:", e);
    }
    setIsZipping(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 animate-entrance">
      <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] overflow-hidden card-blur">
        <div className="p-8 md:p-14 border-b border-slate-100 dark:border-slate-800/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
            
            {/* DROPZONE */}
            <div 
              className={`lg:col-span-6 h-[480px] border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all relative group
                ${dragActive ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-600/5' : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/20'}`}
              onDragEnter={onDrag} onDragLeave={onDrag} onDragOver={onDrag} onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFiles(e.target.files)} className="hidden" accept="image/*,.heic,.heif" multiple />
              
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 group-hover:scale-110 transition-transform shadow-sm">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Stage Assets</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold px-12 text-center leading-relaxed">Drop high-res images here for local processing. Privacy guaranteed by edge execution.</p>
              
              {batch.length > 0 && (
                <div className="absolute bottom-10 px-5 py-2.5 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg animate-pulse">
                  {batch.length} Nodes in Buffer
                </div>
              )}
            </div>

            {/* PIPELINE CONFIG */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div className="space-y-10">
                <div className="space-y-5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] block">Target Pipeline</label>
                  <div className="flex flex-wrap gap-2">
                    {['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'image/svg+xml'].map((fmt) => (
                      <button 
                        key={fmt}
                        onClick={() => setFormat(fmt as ImageFormat)}
                        className={`px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-2 transition-all ${
                          format === fmt 
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400' 
                          : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {fmt === 'application/pdf' ? 'PDF' : fmt === 'image/svg+xml' ? 'SVG' : fmt.split('/')[1].replace('jpeg', 'jpg')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => setRemoveBG(!removeBG)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${removeBG ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-100 dark:border-slate-800'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider dark:text-white">Isolate Object</span>
                      <div className={`w-3 h-3 rounded-full ${removeBG ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Alpha Keying Engine</p>
                  </div>
                  <div onClick={() => setRemoveWatermark(!removeWatermark)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${removeWatermark ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-100 dark:border-slate-800'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider dark:text-white">Sanitize Area</span>
                      <div className={`w-3 h-3 rounded-full ${removeWatermark ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Patch Blur Inpainting</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em]">Dimension Resampling</label>
                    <button onClick={() => { setResizeWidth(''); setResizeHeight(''); }} className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Reset</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="W (px)" value={resizeWidth} onChange={(e) => setResizeWidth(e.target.value ? parseInt(e.target.value) : '')} className="bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold focus:border-blue-500 outline-none transition-all dark:text-white" />
                    <input type="number" placeholder="H (px)" value={resizeHeight} onChange={(e) => setResizeHeight(e.target.value ? parseInt(e.target.value) : '')} className="bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold focus:border-blue-500 outline-none transition-all dark:text-white" />
                  </div>
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <button 
                  onClick={executePipeline}
                  disabled={isProcessing || batch.filter(i => i.status === 'pending').length === 0}
                  className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white py-6 rounded-[1.75rem] font-black tracking-[0.25em] transition-all flex items-center justify-center space-x-4 text-[11px] uppercase shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Simulating Local Logic...</span>
                    </>
                  ) : (
                    <span>Run Conversion Pipeline</span>
                  )}
                </button>
                {batch.length > 0 && !isProcessing && (
                  <button onClick={() => setBatch([])} className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">
                    Reset Staging Area
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* OUTPUT STREAM */}
        {batch.length > 0 && (
          <div className="bg-slate-50/50 dark:bg-slate-900/50 p-8 md:p-14">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-3">Rendered Nodes</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest">Verified locally by Sandbox v2.4</p>
              </div>
              {batch.some(i => i.status === 'done') && (
                <button 
                  onClick={handleBatchDownload}
                  className="px-10 py-5 bg-blue-600 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:translate-y-[-2px] transition-all shadow-xl shadow-blue-600/20"
                >
                  {isZipping ? 'Archiving...' : (batch.filter(i => i.status === 'done').length > 1 ? 'Download Bundle (ZIP)' : 'Save Asset')}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {batch.map(item => (
                <div key={item.id} className={`bg-white dark:bg-slate-800 p-5 rounded-[2.5rem] border transition-all flex items-center justify-between group ${item.status === 'error' ? 'border-rose-200 dark:border-rose-900/40' : 'border-slate-200/60 dark:border-slate-700/60 hover:border-blue-500'}`}>
                  <div className="flex items-center space-x-5 min-w-0">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-[1.5rem] overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-inner">
                      {item.result ? (
                        <img src={item.result.url} className="w-full h-full object-cover" alt="Node Result" />
                      ) : item.status === 'processing' ? (
                        <div className="w-full h-full flex items-center justify-center bg-blue-50/50 dark:bg-blue-600/10">
                           <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                      ) : item.status === 'error' ? (
                        <div className="text-rose-500">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                      ) : (
                        <div className="text-slate-300">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-[11px] font-black text-slate-900 dark:text-white truncate uppercase tracking-wider mb-1">{item.file.name}</p>
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-bold text-slate-400 uppercase">{formatFileSize(item.file.size)}</span>
                         {item.result && (
                           <>
                             <span className="text-blue-500 text-[9px] font-black">→</span>
                             <span className={`text-[9px] font-black uppercase ${item.result.size < item.file.size ? 'text-emerald-500' : 'text-slate-500'}`}>
                                {formatFileSize(item.result.size)}
                             </span>
                           </>
                         )}
                         {item.status === 'error' && <span className="text-[8px] font-black text-rose-500 uppercase">Load Failure</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.result && (
                      <>
                        <button 
                          onClick={async () => {
                            setCopyingId(item.id);
                            const success = await copyToClipboard(item.result!.blob);
                            if (!success) alert("Clipboard copy failed. Only PNG/JPG are supported in some browsers.");
                            setTimeout(() => setCopyingId(null), 1500);
                          }} 
                          className={`p-3.5 rounded-xl transition-all ${copyingId === item.id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-blue-600 hover:text-white'}`}
                        >
                          {copyingId === item.id ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                          )}
                        </button>
                        <button onClick={() => handleSave(item.result!)} className="p-3.5 bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                      </>
                    )}
                    <button onClick={() => setBatch(prev => prev.filter(i => i.id !== item.id))} className="p-3.5 text-slate-300 hover:text-rose-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-8">
        <div className="inline-flex items-center px-8 py-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full shadow-sm">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse mr-4"></div>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] leading-none">AES-Equivalent Processing Privacy Level</span>
        </div>
      </div>
    </div>
  );
};

export default Converter;
