
import React, { useState, useRef, useEffect } from 'react';
import { ImageFormat, ProcessedImage, ImageProcessOptions } from '../types';
import { processImage, formatFileSize } from '../services/imageProcessor';

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
  customOptions?: Partial<ImageProcessOptions>;
  previewUrl: string;
}

const Converter: React.FC<ConverterProps> = ({ 
  defaultFormat = 'image/png',
  initialOptions = {} as Partial<ImageProcessOptions>
}) => {
  const [batch, setBatch] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const [format, setFormat] = useState<ImageFormat>(initialOptions.format || defaultFormat);
  const [quality, setQuality] = useState(initialOptions.quality || 0.85);
  const [resizeWidth, setResizeWidth] = useState<number | ''>(initialOptions.width || '');
  const [resizeHeight, setResizeHeight] = useState<number | ''>(initialOptions.height || '');
  const [removeBG, setRemoveBG] = useState(initialOptions.removeBackground || false);
  const [removeWatermark, setRemoveWatermark] = useState(initialOptions.removeWatermark || false);
  const [stripMetadata, setStripMetadata] = useState(initialOptions.stripMetadata ?? true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialOptions.format) setFormat(initialOptions.format as ImageFormat);
    if (initialOptions.quality !== undefined) setQuality(initialOptions.quality);
    if (initialOptions.removeBackground !== undefined) setRemoveBG(initialOptions.removeBackground);
    if (initialOptions.removeWatermark !== undefined) setRemoveWatermark(initialOptions.removeWatermark);
    if (initialOptions.stripMetadata !== undefined) setStripMetadata(initialOptions.stripMetadata);
  }, [initialOptions]);

  const handleFiles = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => 
      f.type.startsWith('image/') || 
      f.name.toLowerCase().match(/\.(heic|heif|jpg|jpeg|png|webp)$/)
    );
    const newItems: BatchItem[] = validFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      status: 'pending',
      progress: 0,
      previewUrl: URL.createObjectURL(file)
    }));
    setBatch(prev => [...prev, ...newItems]);
  };

  const onDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); };
  const onDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); };

  const executePipeline = async () => {
    if (batch.filter(i => i.status === 'pending').length === 0) return;
    setIsProcessing(true);
    
    for (let i = 0; i < batch.length; i++) {
      if (batch[i].status !== 'pending') continue;
      
      const currentId = batch[i].id;

      try {
        const itemOptions = {
          format,
          quality,
          width: resizeWidth || undefined,
          height: resizeHeight || undefined,
          removeBackground: removeBG,
          removeWatermark,
          stripMetadata,
          ...batch[i].customOptions
        };

        const result = await processImage(
          batch[i].file, 
          itemOptions as ImageProcessOptions,
          (percent) => {
            setBatch(prev => prev.map(item => 
              item.id === currentId 
                ? { ...item, status: 'processing', progress: percent } 
                : item
            ));
          }
        );

        setBatch(prev => prev.map(item => 
          item.id === currentId 
            ? { ...item, result, status: 'done', progress: 100 } 
            : item
        ));
      } catch (err: any) {
        setBatch(prev => prev.map(item => 
          item.id === currentId 
            ? { ...item, status: 'error', error: err.message, progress: 0 } 
            : item
        ));
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
      const JSZipMod = await import('jszip');
      const JSZip = JSZipMod.default || JSZipMod;
      const zip = new (JSZip as any)();
      ready.forEach(item => { if (item.result) zip.file(item.result.name, item.result.blob); });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `imageto-bundle-${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error(e); }
    setIsZipping(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 animate-entrance">
      <div className="card-pro rounded-[2.5rem] overflow-hidden">
        <div className="p-8 md:p-14 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
            
            <div 
              className={`lg:col-span-6 h-auto min-h-[480px] border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all relative group py-12
                ${dragActive ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-600/10' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/20'}`}
              onDragEnter={onDrag} onDragLeave={onDrag} onDragOver={onDrag} onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFiles(e.target.files)} className="hidden" accept="image/*,.heic,.heif" multiple />
              
              <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2.2rem] flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-8 group-hover:scale-110 transition-transform shadow-sm border border-slate-100 dark:border-slate-800 ring-4 ring-indigo-50/50 dark:ring-indigo-900/10">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight text-center">Stage Assets</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold px-12 text-center leading-relaxed">Drop images here. Handled 100% locally in your browser sandbox.</p>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between">
              <div className="space-y-10">
                <div className="space-y-5">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] block">Target Pipeline</label>
                  <div className="flex flex-wrap gap-2.5">
                    {['image/png', 'image/jpeg', 'image/webp', 'application/pdf'].map((fmt) => (
                      <button 
                        key={fmt}
                        onClick={() => setFormat(fmt as ImageFormat)}
                        className={`px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] border-2 transition-all ${
                          format === fmt 
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                          : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-950'
                        }`}
                      >
                        {fmt === 'application/pdf' ? 'PDF' : fmt.split('/')[1].replace('jpeg', 'jpg')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                   <div onClick={() => setStripMetadata(!stripMetadata)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center space-x-3 ${stripMetadata ? 'border-indigo-500/50 bg-indigo-50/5 dark:bg-indigo-600/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950'}`}>
                    <div className={`w-3 h-3 rounded-full ${stripMetadata ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Clean Meta</span>
                  </div>
                  <div onClick={() => setRemoveBG(!removeBG)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center space-x-3 ${removeBG ? 'border-emerald-500/50 bg-emerald-50/5 dark:bg-emerald-600/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950'}`}>
                    <div className={`w-3 h-3 rounded-full ${removeBG ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Isolate Object</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">Compression Logic</label>
                    <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg">{Math.round(quality * 100)}%</span>
                  </div>
                  <input type="range" min="0.1" max="1.0" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full" />
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <button 
                  onClick={executePipeline}
                  disabled={isProcessing || batch.filter(i => i.status === 'pending').length === 0}
                  className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-950 dark:hover:bg-indigo-700 text-white py-6 rounded-[2rem] font-black tracking-[0.3em] transition-all flex items-center justify-center space-x-4 text-[12px] uppercase shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isProcessing ? (
                    <span className="flex items-center space-x-2">
                       <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       <span>Processing Pipeline...</span>
                    </span>
                  ) : (
                    <span className="group-hover:translate-x-1 transition-transform">Execute Local Engine</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {batch.length > 0 && (
          <div className="bg-slate-50/80 dark:bg-slate-900/40 p-8 md:p-14">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
              <div>
                <h3 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter">Rendered Assets</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em]">Client-Side Integrity Verified</p>
              </div>
              {batch.some(i => i.status === 'done') && (
                <button onClick={handleBatchDownload} className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.25em] shadow-xl hover:scale-105 transition-transform">
                  {isZipping ? 'Archiving...' : 'Save All Assets'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {batch.map(item => (
                <div key={item.id} className="p-5 rounded-[2.2rem] border transition-all flex flex-col group bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-sm hover:shadow-md">
                  
                  {/* Progress Bar (Visible during processing) */}
                  {item.status === 'processing' && (
                    <div className="absolute bottom-0 left-0 h-1 bg-indigo-100 dark:bg-indigo-900/20 w-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 transition-all duration-300 ease-out" 
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-5 min-w-0">
                      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-inner border border-slate-200 dark:border-slate-800">
                        {item.result ? <img src={item.result.url} className="w-full h-full object-cover" alt="Result" /> : <img src={item.previewUrl} className="w-full h-full object-cover opacity-30" alt="Preview" />}
                        
                        {item.status === 'processing' && (
                           <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-[2px]">
                              <span className="text-[11px] font-black text-indigo-600">{item.progress}%</span>
                           </div>
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-[12px] font-black text-slate-900 dark:text-white truncate uppercase tracking-widest mb-1">{item.file.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{formatFileSize(item.file.size)}</span>
                          {item.status === 'processing' && (
                             <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest animate-pulse">Running...</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.result && (
                        <button onClick={() => handleSave(item.result!)} className="p-4 bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                      )}
                      <button onClick={() => setBatch(prev => prev.filter(i => i.id !== item.id))} className="p-4 text-slate-300 hover:text-rose-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Converter;
