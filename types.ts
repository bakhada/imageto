
export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export interface ImageProcessOptions {
  format: ImageFormat;
  quality: number;
  width?: number;
  height?: number;
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

export interface ToolMetadata {
  id: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  defaultFormat: ImageFormat;
  slug: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
