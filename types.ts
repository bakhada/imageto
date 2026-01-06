
export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf';

// Define the CropArea interface used for visual cropping operations
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: 'px' | '%';
}

export interface ImageProcessOptions {
  format: ImageFormat;
  quality: number;
  width?: number;
  height?: number;
  removeBackground?: boolean;
  removeWatermark?: boolean;
  stripMetadata?: boolean;
  cropAspect?: string;
  vectorize?: boolean;
  // PDF specific options
  pdfPageSize?: 'original' | 'a4' | 'letter' | 'legal' | 'tabloid';
  pdfOrientation?: 'p' | 'l';
  pdfMargin?: number;
}

export interface ProcessedImage {
  id: string;
  url: string;
  blob: Blob;
  name: string;
  size: number;
  originalSize: number;
  width: number;
  height: number;
  format: ImageFormat;
  status: 'pending' | 'processing' | 'done' | 'error';
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  metaDescription: string;
  keywords: string[];
  content: string[];
  author: {
    name: string;
    role: string;
    bio: string;
    avatar: string;
  };
  readTime: string;
}

export interface ToolMetadata {
  id: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  detailedContent?: string;
  longDescription?: string;
  howToSteps?: string[];
  features?: string[];
  defaultFormat: ImageFormat;
  slug: string;
  initialOptions?: Partial<ImageProcessOptions>;
}

export interface FAQItem {
  question: string;
  answer: string;
}
