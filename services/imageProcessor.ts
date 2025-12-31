
import { ImageFormat, ImageProcessOptions, ProcessedImage } from '../types';

/**
 * Processes an image file locally using Canvas API
 */
export const processImage = async (
  file: File,
  options: ImageProcessOptions
): Promise<ProcessedImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }

        // Determine final dimensions
        let targetWidth = options.width || img.width;
        let targetHeight = options.height || img.height;

        // Maintain aspect ratio if one dimension missing
        if (options.width && !options.height) {
          targetHeight = (img.height / img.width) * options.width;
        } else if (!options.width && options.height) {
          targetWidth = (img.width / img.height) * options.height;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Apply smoothing for better downscaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Convert to Blob for accuracy and memory efficiency
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas to Blob failed'));
            }

            const url = URL.createObjectURL(blob);
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const extension = options.format.split('/')[1].replace('jpeg', 'jpg');

            resolve({
              id: Math.random().toString(36).substr(2, 9),
              url,
              blob,
              name: `${baseName}.${extension}`,
              size: blob.size,
              originalSize: file.size,
              width: targetWidth,
              height: targetHeight,
              format: options.format,
              status: 'done'
            });
          },
          options.format,
          options.quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Copies a blob to the system clipboard (if supported)
 */
export const copyToClipboard = async (blob: Blob): Promise<boolean> => {
  try {
    const item = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
