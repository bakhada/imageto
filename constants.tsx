
import React from 'react';
import { ToolMetadata } from './types';

export const TOOLS: ToolMetadata[] = [
  {
    id: 'jpg-to-png',
    slug: 'convert-jpg-to-png',
    title: 'JPG to PNG',
    h1: 'Convert JPG to PNG Online — 100% Private & Free',
    metaTitle: 'JPG to PNG Converter Online | Private & High Quality | imageto.org',
    metaDescription: 'Convert JPG to PNG instantly in your browser. No file uploads to servers. Maintain transparency and high resolution. Fast, free, and secure.',
    description: 'Convert your JPEG images to high-quality PNG format locally. Ideal for graphics requiring transparency and lossless quality.',
    defaultFormat: 'image/png'
  },
  {
    id: 'png-to-jpg',
    slug: 'convert-png-to-jpg',
    title: 'PNG to JPG',
    h1: 'Convert PNG to JPG Online — Secure Browser-Side Processing',
    metaTitle: 'PNG to JPG Converter | Fast, Free & Private Image Conversion',
    metaDescription: 'Easily convert PNG files to JPG format to save space. Process images locally on your device for absolute privacy. No sign-up required.',
    description: 'Convert PNG files to JPG format to save space and ensure compatibility across platforms while keeping your data safe.',
    defaultFormat: 'image/jpeg'
  },
  {
    id: 'jpg-to-webp',
    slug: 'convert-jpg-to-webp',
    title: 'JPG to WebP',
    h1: 'Convert JPG to WebP — Optimize Your Website Speed',
    metaTitle: 'JPG to WebP Converter | Modern Web Image Optimization',
    metaDescription: 'Modernize your website images. Convert JPG to WebP for superior compression and faster page loads. 100% private conversion.',
    description: 'Modernize your images. Convert JPG to WebP for superior compression and faster website loading without server uploads.',
    defaultFormat: 'image/webp'
  },
  {
    id: 'png-to-webp',
    slug: 'convert-png-to-webp',
    title: 'PNG to WebP',
    h1: 'Convert PNG to WebP — High Fidelity, Small Size',
    metaTitle: 'PNG to WebP Online Converter | Maintain Transparency Securely',
    metaDescription: 'Convert PNG to WebP to keep transparency with up to 30% smaller file sizes. Native browser processing ensures your files never leave your PC.',
    description: 'Convert PNG to WebP to maintain transparency with significantly smaller file sizes using our secure edge-processing engine.',
    defaultFormat: 'image/webp'
  },
  {
    id: 'compress-image',
    slug: 'compress-image-online',
    title: 'Compress Image',
    h1: 'Online Image Compressor — Reduce File Size Privately',
    metaTitle: 'Compress Images Online | Free Tool to Shrink File Size | imageto.org',
    metaDescription: 'Shrink your image file size without losing visible quality. Perfect for email and web. Secure local processing means no data leakage.',
    description: 'Shrink your images without losing visible quality. Perfect for email attachments and web assets. 100% local processing.',
    defaultFormat: 'image/jpeg'
  },
  {
    id: 'resize-image',
    slug: 'resize-image-online',
    title: 'Resize Image',
    h1: 'Online Image Resizer — Change Dimensions Instantly',
    metaTitle: 'Resize Images Online | Change Width & Height Privately',
    metaDescription: 'Easily change the pixel dimensions of your images. Fast browser-side resizing for social media, profiles, or website optimization.',
    description: 'Easily change the width and height of your images for social media or websites using our private browser-side engine.',
    defaultFormat: 'image/png'
  }
];

export const BLOG_POSTS = [
  {
    slug: "browser-based-vs-server-converters",
    title: "Why You Should Stop Using Server-Based Image Converters",
    excerpt: "Most 'free' online converters upload your private photos to remote servers. Learn why browser-side processing is the only safe way to handle your data.",
    date: "Feb 24, 2025",
    category: "Privacy",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200",
    metaDescription: "Discover the hidden risks of cloud image converters and why client-side browser processing is the future of digital privacy."
  },
  {
    slug: "webp-vs-jpeg-performance-guide",
    title: "WebP vs JPEG: Boosting Your Website Speed by 30%",
    excerpt: "Google's WebP format offers superior compression for web images. We break down the technical benefits and how to switch to next-gen formats.",
    date: "Feb 22, 2025",
    category: "Performance",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    metaDescription: "A technical comparison of WebP and JPEG. Learn how modern image formats can drastically improve your Core Web Vitals and SEO."
  },
  {
    slug: "ultimate-guide-image-compression-2025",
    title: "The Ultimate Guide to Image Compression Without Quality Loss",
    excerpt: "Struggling with large image files? Discover how to balance byte size and visual fidelity for Instagram and LinkedIn.",
    date: "Feb 20, 2025",
    category: "Tutorial",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    metaDescription: "Master the art of image compression. This guide shows you how to reduce file sizes for web and social media while keeping high resolution."
  },
  {
    slug: "seo-image-optimization-checklist",
    title: "SEO Image Optimization Checklist: Rank #1 on Google Images",
    excerpt: "Beyond alt text: learn the advanced strategies for optimizing image filenames, dimensions, and descriptive metadata for search engines.",
    date: "Feb 18, 2025",
    category: "SEO",
    image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&q=80&w=1200",
    metaDescription: "Maximize your organic reach. Our 10-step checklist covers everything from descriptive filenames to responsive image serving."
  },
  {
    slug: "bulk-resizing-hacks-for-designers",
    title: "Bulk Image Resizing: 5 Productivity Hacks for UI Designers",
    excerpt: "Handling 100+ assets for a new UI kit? Learn how to automate your resizing workflow without leaving your browser or using heavy software.",
    date: "Feb 16, 2025",
    category: "Design",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1200",
    metaDescription: "Save hours of manual work. Explore browser-based bulk resizing techniques that preserve aspect ratios and design integrity."
  },
  {
    slug: "ecommerce-product-photo-optimization",
    title: "How to Optimize Product Photos for Shopify and Amazon",
    excerpt: "High-quality product images are the core of e-commerce. Discover the ideal dimensions and formats to increase your conversion rates.",
    date: "Feb 14, 2025",
    category: "Ecommerce",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200",
    metaDescription: "E-commerce image optimization guide. Learn how to format product shots for fast loading and crystal-clear mobile display."
  },
  {
    slug: "exif-metadata-and-privacy",
    title: "EXIF Metadata and Privacy: Why You Should Strip Location Data",
    excerpt: "Your photos contain more than just pixels. Learn about the hidden GPS data in your images and how to remove it before sharing online.",
    date: "Feb 12, 2025",
    category: "Privacy",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200",
    metaDescription: "Protect your personal safety. A deep dive into EXIF data and how local image processing helps you scrub sensitive location metadata."
  },
  {
    slug: "improving-core-web-vitals-with-images",
    title: "Improving Core Web Vitals: A Guide for Web Developers",
    excerpt: "LCP and CLS are heavily influenced by image handling. Learn how to use modern formats and explicit dimensions to pass Google's tests.",
    date: "Feb 10, 2025",
    category: "Development",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1200",
    metaDescription: "Pass the Google PageSpeed Insights test. Learn how client-side image optimization plays a role in modern web performance metrics."
  },
  {
    slug: "reducing-mobile-data-consumption",
    title: "How Image Compression Helps Reduce Mobile Data Usage",
    excerpt: "The mobile web is getting heavier. See how optimizing your assets can improve accessibility for users with limited data plans.",
    date: "Feb 08, 2025",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200",
    metaDescription: "Build a more accessible web. Discover why aggressive image compression is vital for the global mobile-first audience."
  },
  {
    slug: "future-of-browser-side-media-tools",
    title: "Wasm and Canvas: The Future of Media Tools is in the Browser",
    excerpt: "Heavy video and image editing no longer require desktop apps. Explore how WebAssembly is revolutionizing in-browser performance.",
    date: "Feb 06, 2025",
    category: "Innovation",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    metaDescription: "The technical future of web-based editing. Learn how Wasm enables desktop-level performance for private, client-side tools."
  }
];

export const GENERAL_FAQ = [
  {
    question: "Is imageto.org truly private?",
    answer: "Yes. Unlike other converters, we use your browser's local RAM and CPU. Your images are never sent to a server, ensuring 100% privacy and security for sensitive data."
  },
  {
    question: "Do I need to pay for high-quality conversions?",
    answer: "No. All features, including high-resolution processing and batch conversion, are completely free with no daily limits."
  },
  {
    question: "How do I convert images without uploading?",
    answer: "Our site uses the File API and Canvas API built into your browser. When you drop an image, it stays on your computer while we redraw it in the target format."
  }
];
