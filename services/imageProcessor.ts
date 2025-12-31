
import { ImageFormat, ImageProcessOptions, ProcessedImage } from '../types';

/**
 * Robust image loader using Promises to ensure sequential execution in async pipelines
 */
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Local media buffer load failure'));
    img.src = src;
  });
};

/**
 * Helper to get the correct function from a dynamically imported module
 */
async function getModuleFunction(moduleName: string, possibleNames: string[]) {
  // @ts-ignore
  const mod = await import(/* @vite-ignore */ moduleName);
  for (const name of possibleNames) {
    if (mod[name] && typeof mod[name] === 'function') return mod[name];
  }
  if (mod.default) {
    if (typeof mod.default === 'function') return mod.default;
    for (const name of possibleNames) {
      if (mod.default[name] && typeof mod.default[name] === 'function') return mod.default[name];
    }
  }
  if (typeof mod === 'function') return mod;
  return null;
}

/**
 * Processes an image file locally using Canvas API and specialized browser-side codecs
 */
export const processImage = async (
  file: File,
  options: ImageProcessOptions
): Promise<ProcessedImage> => {
  let sourceBlob: Blob = file;

  // 1. Specialized HEIC/HEIF Decoder (Loaded on-demand)
  if (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif') || file.type === 'image/heic') {
    try {
      const heic2any = await getModuleFunction('heic2any', ['heic2any']);
      
      if (!heic2any) {
        throw new Error('HEIC decoder failed to initialize correctly');
      }

      const converted = await (heic2any as any)({ 
        blob: file, 
        toType: 'image/jpeg', 
        quality: 0.85 
      });
      sourceBlob = Array.isArray(converted) ? converted[0] : converted;
    } catch (e) {
      console.error("HEIC decoding failed", e);
      throw new Error("Unable to decode HEIC locally. Ensure the file is not corrupted.");
    }
  }

  // Convert blob to DataURL for Canvas processing
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('FileReader error during staging'));
    reader.readAsDataURL(sourceBlob);
  });

  let img = await loadImage(dataUrl);

  // 2. Local-Side Background Isolation
  if (options.removeBackground) {
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
        const dr = Math.abs(data[i] - r);
        const dg = Math.abs(data[i+1] - g);
        const db = Math.abs(data[i+2] - b);
        if (dr < tolerance && dg < tolerance && db < tolerance) {
          data[i+3] = 0;
        }
      }
      bgCtx.putImageData(imageData, 0, 0);
      img = await loadImage(bgCanvas.toDataURL());
    }
  }

  // 3. Staging Render Canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Sandbox canvas context initialization failed');

  let targetWidth = options.width || img.width;
  let targetHeight = options.height || img.height;

  if (options.width && !options.height) {
    targetHeight = (img.height / img.width) * options.width;
  } else if (!options.width && options.height) {
    targetWidth = (img.width / img.height) * options.height;
  }

  let sourceX = 0, sourceY = 0;
  let sourceWidth = img.width, sourceHeight = img.height;

  if (options.cropAspect) {
    const [aw, ah] = options.cropAspect.split(':').map(Number);
    const targetAspect = aw / ah;
    const currentAspect = img.width / img.height;

    if (currentAspect > targetAspect) {
      sourceWidth = img.height * targetAspect;
      sourceX = (img.width - sourceWidth) / 2;
    } else {
      sourceHeight = img.width / targetAspect;
      sourceY = (img.height - sourceHeight) / 2;
    }
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);

  // 4. Heuristic Sanitizer
  if (options.removeWatermark) {
    const patchAreas = [
      { x: 0.70, y: 0.85, w: 0.30, h: 0.15 },
      { x: 0.0, y: 0.85, w: 0.30, h: 0.15 }
    ];
    ctx.filter = 'blur(24px)';
    patchAreas.forEach(area => {
      const px = targetWidth * area.x;
      const py = targetHeight * area.y;
      const pw = targetWidth * area.w;
      const ph = targetHeight * area.h;
      ctx.drawImage(canvas, px, py, pw, ph, px, py, pw, ph);
    });
    ctx.filter = 'none';
  }

  const fileNameNoExt = file.name.replace(/\.[^/.]+$/, "");

  // 5. Specialized Format Generation
  if (options.format === 'application/pdf') {
    // @ts-ignore
    const jsPDFMod = await import(/* @vite-ignore */ 'jspdf');
    const jsPDF = jsPDFMod.jsPDF || jsPDFMod.default || jsPDFMod;
    
    const orientation = targetWidth > targetHeight ? 'l' : 'p';
    const pdf = new (jsPDF as any)({ 
      orientation, 
      unit: 'px', 
      format: [targetWidth, targetHeight] 
    });
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, targetWidth, targetHeight, 'F');
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, targetWidth, targetHeight);
    const blob = pdf.output('blob');
    return createProcessedItem(blob, fileNameNoExt + '.pdf', 'application/pdf', targetWidth, targetHeight, file.size);
  }

  const outputBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Binary encoding failure')), options.format, options.quality);
  });

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

export const copyToClipboard = async (blob: Blob): Promise<boolean> => {
  try {
    if (!['image/png', 'image/jpeg'].includes(blob.type)) return false;
    if (typeof ClipboardItem === 'undefined') return false;
    const item = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (err) {
    console.error("Sandbox clipboard access denied:", err);
    return false;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) '0 B';
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
};
