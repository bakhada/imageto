
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ImageFormat, ProcessedImage } from '../types';
import { processImage, formatFileSize, copyToClipboard } from '../services/imageProcessor';
import JSZip from 'jszip';

interface ConverterProps {
  defaultFormat?: ImageFormat;
}

interface BatchItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'done' | 'error';
  progress: number;
  result?: ProcessedImage;
}

const Converter: React.FC<ConverterProps> = ({ defaultFormat = 'image/png' }) => {
  const [batch, setBatch] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const [format, setFormat] = useState<ImageFormat>(defaultFormat);
  const [quality, setQuality] = useState(0.85);
  const [resizeWidth, setResizeWidth] = useState<number | ''>('');
  const [resizeHeight, setResizeHeight] = useState<number | ''>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      batch.forEach(item => {
        if (item.result?.url) URL.revokeObjectURL(item.result.url);
      });
    };
  }, [batch]);

  const handleFiles = (files: FileList | File[]) => {
    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    const newItems: BatchItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
      progress: 0
    }));
    setBatch(prev => [...prev, ...newItems]);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }, []);

  const runBatchConversion = async () => {
    if (batch.filter(i => i.status === 'pending').length === 0) return;
    setIsProcessing(true);
    
    const updatedBatch = [...batch];
    
    for (let i = 0; i < updatedBatch.length; i++) {
      if (updatedBatch[i].status !== 'pending') continue;

      updatedBatch[i].status = 'processing';
      updatedBatch[i].progress = 10;
      setBatch([...updatedBatch]);

      try {
        const result = await processImage(updatedBatch[i].file, {
          format,
          quality,
          width: resizeWidth || undefined,
          height: resizeHeight || undefined
        });
        
        updatedBatch[i].result = result;
        updatedBatch[i].status = 'done';
        updatedBatch[i].progress = 100;
      } catch (err) {
        console.error(`Failed to process ${updatedBatch[i].file.name}`, err);
        updatedBatch[i].status = 'error';
      }
      
      setBatch([...updatedBatch]);
    }

    setIsProcessing(false);
  };

  const downloadSingle = (result: ProcessedImage) => {
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAsZip = async () => {
    const completedItems = batch.filter(i => i.status === 'done' && i.result);
    if (completedItems.length === 0) return;

    // Handle single file download directly without zip
    if (completedItems.length === 1 && completedItems[0].result) {
      downloadSingle(completedItems[0].result);
      return;
    }

    setIsZipping(true);
    const zip = new JSZip();
    
    completedItems.forEach(item => {
      if (item.result) {
        zip.file(item.result.name, item.result.blob);
      }
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `imageto-batch-${new Date().getTime()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsZipping(false);
  };

  const removeItem = (id: string) => {
    setBatch(prev => {
      const item = prev.find(i => i.id === id);
      if (item?.result?.url) URL.revokeObjectURL(item.result.url);
      return prev.filter(i => i.id !== id);
    });
  };

  const handleCopy = async (result: ProcessedImage) => {
    const success = await copyToClipboard(result.blob);
    if (success) {
      setCopyingId(result.id);
      setTimeout(() => setCopyingId(null), 2000);
    }
  };

  const completedCount = batch.filter(i => i.status === 'done').length;
  const totalCount = batch.length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 animate-entrance">
      <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] dark:shadow-none overflow-hidden card-blur transition-all duration-500">
        <div className="p-10 md:p-14 border-b border-slate-100 dark:border-slate-800/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
            
            {/* 1. The Magnetic Intake Zone */}
            <div 
              className={`lg:col-span-6 h-[400px] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative group
                ${dragActive ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFiles(e.target.files)} className="hidden" accept="image/*" multiple />
              
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-sm">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              
              <div className="text-center px-10">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Load Assets</h3>
                <p className="text-base text-slate-500 dark:text-slate-400 font-semibold max-w-xs mx-auto">Drop files here or browse to start your private conversion pipeline</p>
              </div>

              {batch.length > 0 && (
                <div className="absolute top-6 right-6 px-4 py-2 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-2xl animate-pulse">
                  {batch.length} files staged
                </div>
              )}
            </div>

            {/* 2. Precision Engine Settings */}
            <div className="lg:col-span-6 flex flex-col justify-between self-stretch">
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block">Target Format</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['image/png', 'image/jpeg', 'image/webp'].map((fmt) => (
                      <button 
                        key={fmt}
                        onClick={() => setFormat(fmt as ImageFormat)}
                        className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                          format === fmt 
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-white' 
                          : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        {fmt.split('/')[1].replace('jpeg', 'jpg')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Fidelity</label>
                    <span className="mono text-sm font-bold text-blue-600">{Math.round(quality * 100)}%</span>
                  </div>
                  <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Max Width</label>
                    <input 
                      type="number" 
                      placeholder="Auto" 
                      value={resizeWidth} 
                      onChange={(e) => setResizeWidth(e.target.value ? parseInt(e.target.value) : '')} 
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none dark:text-slate-200 transition-all" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Max Height</label>
                    <input 
                      type="number" 
                      placeholder="Auto" 
                      value={resizeHeight} 
                      onChange={(e) => setResizeHeight(e.target.value ? parseInt(e.target.value) : '')} 
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none dark:text-slate-200 transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={runBatchConversion}
                  disabled={isProcessing || batch.filter(i => i.status === 'pending').length === 0}
                  className="w-full sm:flex-grow bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 active:scale-[0.98] disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white py-5 rounded-[1.5rem] font-black tracking-widest transition-all flex items-center justify-center space-x-3 text-[11px] uppercase shadow-2xl shadow-slate-900/10 dark:shadow-blue-600/20"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <span>Processing Engine...</span>
                    </>
                  ) : (
                    <span>Execute Pipeline</span>
                  )}
                </button>
                {batch.length > 0 && (
                  <button onClick={() => setBatch([])} className="w-full sm:w-auto px-10 py-5 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all">
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Output Stream pipeline */}
        {batch.length > 0 && (
          <div className="bg-slate-50/40 dark:bg-slate-900/40 p-10 md:p-14">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Output Stream</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-semibold">Successfully rendered {completedCount} of {totalCount} assets</p>
              </div>
              
              {completedCount > 0 && (
                <button 
                  onClick={downloadAsZip} 
                  disabled={isZipping}
                  className="w-full md:w-auto px-10 py-5 bg-blue-600 dark:bg-white dark:text-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:translate-y-[-2px] transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                >
                  {isZipping ? 'Archiving...' : (completedCount > 1 ? 'Download All (ZIP)' : 'Download Export')}
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              {batch.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-800/80 p-5 rounded-[1.75rem] border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all duration-300">
                  <div className="flex items-center space-x-6 min-w-0">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-700 flex-shrink-0 bg-slate-100 dark:bg-slate-900 shadow-inner">
                      {item.result ? (
                        <img src={item.result.url} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[160px] uppercase tracking-wider">{item.file.name}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="mono text-[10px] font-bold text-slate-400 uppercase">{formatFileSize(item.file.size)}</span>
                        {item.status === 'done' && item.result && (
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600 text-[10px]">→</span>
                            <span className="mono text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">
                              {formatFileSize(item.result.size)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.status === 'done' && item.result && (
                      <>
                        <button 
                          onClick={() => item.result && downloadSingle(item.result)}
                          title="Download file"
                          className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                        <button 
                          onClick={() => item.result && handleCopy(item.result)}
                          title="Copy to clipboard"
                          className={`p-3 rounded-xl transition-all ${copyingId === item.result.id ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-blue-600'}`}
                        >
                          {copyingId === item.result.id ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                          )}
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="p-3 text-slate-300 hover:text-rose-500 transition-colors bg-slate-50 dark:bg-slate-900 rounded-xl"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-3 shadow-[0_0_12px_rgba(37,99,235,0.4)] animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] leading-none">Global Isolation Sync Active — Zero Data Leakage</span>
        </div>
      </div>
    </div>
  );
};

export default Converter;
