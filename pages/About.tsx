
import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <header className="mb-20">
        <h1 className="text-5xl md:text-7xl font-black mb-8 dark:text-white tracking-tighter leading-[0.9]">
          Expertise in <br /><span className="text-indigo-600">Local Media.</span>
        </h1>
        <p className="text-xl font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Built for the Digital Sovereignty Movement</p>
      </header>
      
      <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-400 space-y-12 max-w-none">
        <section className="bg-indigo-600 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <h2 className="text-3xl font-black mb-6 tracking-tight text-white">Our Local-First Mission</h2>
          <p className="text-lg opacity-90 leading-relaxed font-semibold">
            At imageto.org, we are on a mission to decentralize media processing. In a world where every "free" service is a data harvesting trap, we offer a high-performance alternative that respects your hardware and your privacy. Our tools run exclusively on your machine, using your CPU and GPU to perform complex transformations without ever "calling home."
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">The Technical Vanguard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-sm">
              <h3 className="text-lg font-black text-indigo-600 mb-4 uppercase tracking-widest">WebAssembly (Wasm)</h3>
              <p className="text-sm font-bold leading-relaxed">By compiling high-performance C++ and Rust codecs into WebAssembly, we bring desktop-speed image processing to the browser. This allows us to handle heavy 4K photography with near-zero latency.</p>
            </div>
            <div className="p-8 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-sm">
              <h3 className="text-lg font-black text-indigo-600 mb-4 uppercase tracking-widest">Privacy Engineering</h3>
              <p className="text-sm font-bold leading-relaxed">Our "Zero-Knowledge" architecture ensures that even we, the creators, cannot see your files. This is not a policy; it is a technical reality of how our code is structured and executed.</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase text-xs tracking-[0.3em] text-indigo-600">Monetization Transparency</h2>
          <p className="font-bold">
            Google AdSense is our primary partner for keeping imageto.org 100% free for everyone. By hosting high-quality, relevant advertisements, we cover our hosting, CDN, and continuous development costs without ever selling user data. We strictly follow Google's Advertising Policies to ensure a clean, safe, and professional browsing environment.
          </p>
        </section>

        <div className="pt-20 border-t border-slate-200 dark:border-slate-800 text-center">
          <h3 className="text-2xl font-black dark:text-white mb-8 leading-none">Have a Question?</h3>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/contact" className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all">
              Contact Support
            </Link>
            <Link to="/blog" className="px-10 py-5 border border-slate-200 dark:border-slate-800 dark:text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
              Expert Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
