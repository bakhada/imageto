
import { ImageFormat, ImageProcessOptions, ProcessedImage } from '../types';

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Local media buffer load failure'));
    img.src = src;
  });
};

async function getModuleFunction(moduleName: string, possibleNames: string[]) {
  const mod = await import(moduleName);
  for (const name of possibleNames) {
    if (mod[name] && typeof mod[name] === 'function') return mod[name];
  }
  if (mod.default) {
    if (typeof mod.default === 'function') return mod.default;
    for (const name of possibleNames) {
      if (mod.default[name] && typeof mod.default[name] === 'function') return mod.default[name];
    }
  }
  return null;
}

export const processImage = async (
  file: File,
  options: ImageProcessOptions,
  onProgress?: (percent: number) => void
): Promise<ProcessedImage> => {
  let sourceBlob: Blob = file;
  
  onProgress?.(5);

  if (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif') || file.type === 'image/heic') {
    try {
      onProgress?.(15);
      const heic2any = await getModuleFunction('heic2any', ['heic2any']);
      if (!heic2any) throw new Error('HEIC decoder failed to initialize');
      const converted = await (heic2any as any)({ 
        blob: file, 
        toType: 'image/jpeg', 
        quality: options.quality || 0.85 
      });
      sourceBlob = Array.isArray(converted) ? converted[0] : converted;
      onProgress?.(40);
    } catch (e) {
      throw new Error("Unable to decode HEIC locally.");
    }
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('FileReader error during staging'));
    reader.readAsDataURL(sourceBlob);
  });

  onProgress?.(50);

  let img = await loadImage(dataUrl);

  if (options.removeBackground) {
    onProgress?.(60);
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = img.width;
    bgCanvas.height = img.height;
    const bgCtx = bgCanvas.getContext('2d');
    if (bgCtx) {
      bgCtx.drawImage(img, 0, 0);
      const imageData = bgCtx.getImageData(0, 0, bgCanvas.width, bgCanvas.height);
      const data = imageData.data;
      const r = data[0], g = data[1], b = data[2];
      const tolerance = 50;
      for (let i = 0; i < data.length; i += 4) {
        const dr = Math.abs(data[i] - r), dg = Math.abs(data[i+1] - g), db = Math.abs(data[i+2] - b);
        if (dr < tolerance && dg < tolerance && db < tolerance) data[i+3] = 0;
      }
      bgCtx.putImageData(imageData, 0, 0);
      img = await loadImage(bgCanvas.toDataURL());
    }
    onProgress?.(70);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context failure');

  let sourceX = 0, sourceY = 0;
  let sourceWidth = img.naturalWidth, sourceHeight = img.naturalHeight;

  if (options.cropAspect) {
    const [aw, ah] = options.cropAspect.split(':').map(Number);
    const targetAspect = aw / ah;
    const currentAspect = img.naturalWidth / img.naturalHeight;
    if (currentAspect > targetAspect) {
      sourceWidth = img.naturalHeight * targetAspect;
      sourceX = (img.naturalWidth - sourceWidth) / 2;
    } else {
      sourceHeight = img.naturalWidth / targetAspect;
      sourceY = (img.naturalHeight - sourceHeight) / 2;
    }
  }

  let targetWidth = options.width || sourceWidth;
  let targetHeight = options.height || sourceHeight;

  if (options.width && !options.height) {
    targetHeight = (sourceHeight / sourceWidth) * options.width;
  } else if (!options.width && options.height) {
    targetWidth = (sourceWidth / sourceHeight) * options.height;
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);

  onProgress?.(80);

  if (options.removeWatermark) {
    ctx.filter = 'blur(24px)';
    [{ x: 0.70, y: 0.85, w: 0.30, h: 0.15 }, { x: 0.0, y: 0.85, w: 0.30, h: 0.15 }].forEach(area => {
      ctx.drawImage(canvas, targetWidth * area.x, targetHeight * area.y, targetWidth * area.w, targetHeight * area.h, targetWidth * area.x, targetHeight * area.y, targetWidth * area.w, targetHeight * area.h);
    });
    ctx.filter = 'none';
  }

  const fileNameNoExt = file.name.replace(/\.[^/.]+$/, "");

  if (options.format === 'application/pdf') {
    onProgress?.(85);
    const jsPDFMod = await import('jspdf');
    const jsPDF = jsPDFMod.jsPDF || jsPDFMod.default || jsPDFMod;
    let orientation = options.pdfOrientation || (targetWidth > targetHeight ? 'l' : 'p');
    let pdfFormat: string | [number, number] = options.pdfPageSize === 'original' || !options.pdfPageSize ? [targetWidth, targetHeight] : options.pdfPageSize;
    const pdf = new (jsPDF as any)({ orientation, unit: 'px', format: pdfFormat });
    const margin = options.pdfMargin || 0;
    const pdfWidth = pdf.internal.pageSize.getWidth(), pdfHeight = pdf.internal.pageSize.getHeight();
    const scale = Math.min((pdfWidth - margin * 2) / targetWidth, (pdfHeight - margin * 2) / targetHeight);
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
    pdf.addImage(canvas.toDataURL('image/jpeg', options.quality), 'JPEG', (pdfWidth - targetWidth * scale) / 2, (pdfHeight - targetHeight * scale) / 2, targetWidth * scale, targetHeight * scale);
    const blob = pdf.output('blob');
    onProgress?.(100);
    return createProcessedItem(blob, fileNameNoExt + '.pdf', 'application/pdf', pdfWidth, pdfHeight, file.size);
  }

  onProgress?.(90);
  const outputBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Binary encoding failure')), options.format, options.quality);
  });

  onProgress?.(100);
  const finalExt = options.format.split('/')[1].replace('jpeg', 'jpg');
  return createProcessedItem(outputBlob, fileNameNoExt + '.' + finalExt, options.format, targetWidth, targetHeight, file.size);
};

const createProcessedItem = (blob: Blob, name: string, format: string, w: number, h: number, oldSize: number): ProcessedImage => ({
  id: Math.random().toString(36).substring(2, 11),
  url: URL.createObjectURL(blob),
  blob,
  name,
  size: blob.size,
  originalSize: oldSize,
  width: Math.round(w),
  height: Math.round(h),
  format: format as ImageFormat,
  status: 'done'
});

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
};
